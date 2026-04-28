import React from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import indusLogo from '../images/logo.png';
import { sha256Hex } from '../auth/sha256';
import { getOrCreateDeviceId } from '../auth/deviceId';
import { setKioskSession } from '../auth/kioskSession';

const DEVICE_CACHE_PREFIX = 'indus_kiosk_device_allowed_cache_v1:';
const LOCK_KEY = 'indus_kiosk_lock_v1';
const PASSWORD_HASH_CACHE_KEY = 'indus_kiosk_password_sha256_cache_v1';
const PASSWORD_SETTINGS_REF = doc(db, 'kiosk_settings', 'global');

function getLock() {
  try {
    const raw = localStorage.getItem(LOCK_KEY);
    if (!raw) return { attempts: 0, until: 0 };
    const parsed = JSON.parse(raw);
    return {
      attempts: Number(parsed?.attempts || 0),
      until: Number(parsed?.until || 0),
    };
  } catch {
    return { attempts: 0, until: 0 };
  }
}

function setLock(lock) {
  try {
    localStorage.setItem(LOCK_KEY, JSON.stringify(lock));
  } catch {
    // ignore
  }
}

function clearLock() {
  try {
    localStorage.removeItem(LOCK_KEY);
  } catch {
    // ignore
  }
}

function randomToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export default function AccessGate({ onAuthenticated, siteVariant = 'indus' }) {
  // Keep the lock screen common for both Indus + WIIA.
  // (Branding within the unlocked site can still vary by `siteVariant`.)
  void siteVariant;
  const logo = indusLogo;
  const deviceId = React.useMemo(() => getOrCreateDeviceId(), []);

  const expectedHash = String(process.env.REACT_APP_KIOSK_PASSWORD_SHA256 || '').trim().toLowerCase();
  const expectedPlain = String(process.env.REACT_APP_KIOSK_PASSWORD || '').trim();
  // Off by default: set REACT_APP_KIOSK_DEVICE_ALLOWLIST=true to require per-device approval.
  const allowlistEnabled = String(process.env.REACT_APP_KIOSK_DEVICE_ALLOWLIST || '').toLowerCase() === 'true';

  const [password, setPassword] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const [deviceAllowed, setDeviceAllowed] = React.useState(false);
  const [deviceStatus, setDeviceStatus] = React.useState(allowlistEnabled ? 'checking' : 'skipped');
  const [requestSent, setRequestSent] = React.useState(false);
  const [remotePasswordHash, setRemotePasswordHash] = React.useState(() => {
    try {
      return String(localStorage.getItem(PASSWORD_HASH_CACHE_KEY) || '').trim().toLowerCase();
    } catch {
      return '';
    }
  });

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(PASSWORD_SETTINGS_REF);
        const hash = String(snap.exists() ? snap.data()?.passwordHash : '').trim().toLowerCase();
        if (!hash) return;
        if (cancelled) return;
        setRemotePasswordHash(hash);
        try {
          localStorage.setItem(PASSWORD_HASH_CACHE_KEY, hash);
        } catch {
          // ignore
        }
      } catch {
        // ignore network failures; cached value still works
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cacheKey = `${DEVICE_CACHE_PREFIX}${deviceId}`;

  const refreshDeviceAllowed = React.useCallback(async () => {
    if (!allowlistEnabled) return;
    setDeviceStatus('checking');
    try {
      const snap = await getDoc(doc(db, 'kiosk_devices', deviceId));
      const allowed = !!(snap.exists() && snap.data()?.allowed === true);
      setDeviceAllowed(allowed);
      setDeviceStatus('ok');
      try {
        localStorage.setItem(cacheKey, JSON.stringify({ allowed, ts: Date.now() }));
      } catch {
        // ignore
      }
    } catch {
      setDeviceStatus('offline');
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
        if (cached && typeof cached.allowed === 'boolean') setDeviceAllowed(cached.allowed);
      } catch {
        // ignore
      }
    }
  }, [allowlistEnabled, cacheKey, deviceId]);

  React.useEffect(() => {
    refreshDeviceAllowed();
  }, [refreshDeviceAllowed]);

  const requestAccess = async () => {
    setRequestSent(false);
    setError('');
    try {
      await setDoc(
        doc(db, 'kiosk_devices', deviceId),
        {
          deviceId,
          allowed: false,
          requestedAt: serverTimestamp(),
          lastSeenAt: serverTimestamp(),
          userAgent: navigator.userAgent,
        },
        { merge: true }
      );
      setRequestSent(true);
    } catch {
      setError('Unable to send access request from this device (network or permissions).');
    }
  };

  const verifyPassword = async (value) => {
    const trimmed = String(value || '').trim();
    if (remotePasswordHash) {
      const got = await sha256Hex(trimmed);
      return got === remotePasswordHash;
    }
    if (expectedHash) {
      const got = await sha256Hex(trimmed);
      return got === expectedHash;
    }
    if (expectedPlain) return trimmed === expectedPlain;
    return trimmed === '0000';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const lock = getLock();
    if (Date.now() < lock.until) {
      const seconds = Math.max(1, Math.ceil((lock.until - Date.now()) / 1000));
      setError(`Too many attempts. Try again in ${seconds}s.`);
      return;
    }

    setBusy(true);
    try {
      const ok = await verifyPassword(password);
      if (!ok) {
        const nextAttempts = lock.attempts + 1;
        const shouldLock = nextAttempts >= 5;
        setLock({
          attempts: nextAttempts,
          until: shouldLock ? Date.now() + 60 * 1000 : 0,
        });
        setError('Incorrect password.');
        return;
      }

      clearLock();

      if (allowlistEnabled && !deviceAllowed) {
        setError('This computer is not authorized yet. Request access from Admin.');
        return;
      }

      setKioskSession({
        token: randomToken(),
        deviceId,
        createdAt: new Date().toISOString(),
      });
      onAuthenticated?.();
    } finally {
      setBusy(false);
    }
  };

  const showConfigHint = !remotePasswordHash && !expectedHash && !expectedPlain;

  return (
    <div className="min-h-screen w-full bg-[#f2f0ee] flex items-center justify-center p-6">
      <div className="w-full max-w-[440px] bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col items-center">
        {/* Top Branding Section */}
        <div className="w-full p-4 pb-0 flex flex-col items-center">
          <div className="w-full aspect-[16/8] bg-white rounded-[24px] border border-slate-100 shadow-[inset_0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-center p-2 mb-1">
            <div className="flex items-center justify-center w-full h-full p-2">
              <img src={indusLogo} alt="Indus University & WIIA" className="w-full h-full object-contain" />
            </div>
          </div>
          
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Enter Access Password</h1>
          <p className="text-slate-500 font-medium text-center text-[13px]">Unlock the kiosk to view content.</p>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-slate-50"></div>

        {/* Form Section */}
        <div className="w-full p-4 pt-2">
          {allowlistEnabled && (
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] font-medium text-slate-500">
              <div className="flex justify-between items-center mb-2">
                <span className="uppercase tracking-widest opacity-60">Device ID</span>
                <span className="font-mono text-slate-900">{deviceId.slice(0, 8)}...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${deviceAllowed ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                <span className="text-slate-700">
                  {deviceStatus === 'checking' ? 'Verifying...' : (deviceAllowed ? 'Authorized' : 'Pending Approval')}
                </span>
              </div>
              {!deviceAllowed && deviceStatus !== 'checking' && (
                <button 
                  onClick={requestAccess}
                  className="mt-3 w-full py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold hover:bg-slate-50 transition-colors"
                >
                  Request Access
                </button>
              )}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-2">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="w-full bg-[#f8f9fb] px-6 py-6 rounded-[20px] border-none outline-none focus:ring-2 focus:ring-blue-500/10 text-center text-3xl tracking-[0.8em] font-bold text-slate-900 transition-all placeholder:text-slate-300"
                autoFocus
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-[#2563eb] text-white font-bold py-4 rounded-[16px] hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-600/20 uppercase tracking-[0.2em] text-[12px] disabled:opacity-60"
            >
              {busy ? 'Authorizing...' : 'Unlock'}
            </button>
          </form>

          {error && (
            <div className="mt-4 text-[13px] font-semibold text-red-500 text-center">
              {error}
            </div>
          )}

          <div className="mt-2 text-center">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.3em]">Indus University Kiosk</span>
          </div>
        </div>
      </div>
    </div>
  );


}
