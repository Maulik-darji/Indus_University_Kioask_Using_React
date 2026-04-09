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
      <div className="w-full max-w-md bg-white rounded-[1.75rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-8 text-center border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/40">
          <div className="w-56 h-56 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-5 overflow-hidden">
            <img src={logo} alt="Indus University" className="w-full h-full object-contain p-2" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Enter Access Password</h1>
          <p className="text-slate-500 font-bold mt-2 text-sm">Unlock the kiosk to view the website content.</p>
        </div>

        <div className="p-8">
          {allowlistEnabled && (
            <div className="mb-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">This Device</div>
                  <div className="mt-1 font-black text-slate-900 text-xs break-all">{deviceId}</div>
                  <div className="mt-2 text-[11px] font-bold text-slate-500">
                    Status:{' '}
                    <span className="text-slate-700">
                      {deviceStatus === 'checking' && 'Checking…'}
                      {deviceStatus === 'ok' && (deviceAllowed ? 'Authorized' : 'Not Authorized')}
                      {deviceStatus === 'offline' && (deviceAllowed ? 'Authorized (cached)' : 'Offline')}
                      {deviceStatus === 'skipped' && 'Skipped'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(deviceId);
                    } catch {
                      // ignore
                    }
                  }}
                  className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-wider hover:bg-slate-50 active:scale-95 transition-all shrink-0"
                >
                  Copy
                </button>
              </div>

              {!deviceAllowed && (
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={requestAccess}
                    className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black active:scale-95 transition-all"
                  >
                    Request Access
                  </button>
                  <button
                    type="button"
                    onClick={refreshDeviceAllowed}
                    className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-wider hover:bg-slate-50 active:scale-95 transition-all"
                  >
                    Refresh
                  </button>
                </div>
              )}

              {requestSent && (
                <div className="mt-3 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                  Access request sent. Ask Admin to approve this device.
                </div>
              )}
            </div>
          )}

          {showConfigHint && (
            <div className="mb-6 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
              Password is not configured. Default is <span className="font-black">0000</span>. Set
              <span className="font-black"> REACT_APP_KIOSK_PASSWORD</span> or
              <span className="font-black"> REACT_APP_KIOSK_PASSWORD_SHA256</span>.
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              className="w-full bg-slate-50 px-6 py-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-slate-200 text-center text-3xl tracking-[0.5em] font-black text-slate-900"
              autoFocus
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-[0_10px_30px_-10px_rgba(37,99,235,0.5)] uppercase tracking-[0.2em] text-xs disabled:opacity-60"
            >
              {busy ? 'Checking…' : 'Unlock'}
            </button>
          </form>

          {error && (
            <div className="mt-5 text-[12px] font-bold text-red-700 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="mt-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.22em]">
            Indus University Kiosk
          </div>
        </div>
      </div>
    </div>
  );
}
