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
    <div className="min-h-screen w-full bg-[#f8f7f5] flex items-center justify-center p-4 md:p-8 lg:p-12">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-amber-50 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="relative w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Left Side: Branding (Visible on larger screens) */}
        <div className="hidden md:flex w-1/2 bg-slate-900 items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:24px_24px]"></div>
          </div>
          <div className="relative z-10 text-center">
            <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-6 transform hover:rotate-3 transition-transform duration-500">
              <img src={logo} alt="Indus University" className="w-full h-full object-contain p-4" />
            </div>
            <h2 className="text-white text-2xl font-black tracking-tight leading-tight">Indus<br/>University</h2>
            <div className="mt-4 w-12 h-1 bg-blue-500 mx-auto rounded-full"></div>
            <p className="mt-6 text-slate-400 text-sm font-bold uppercase tracking-widest">Kiosk Portal</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <div className="md:hidden w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
              <img src={logo} alt="Logo" className="w-full h-full object-contain p-3" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Welcome Back</h1>
            <p className="text-slate-500 font-bold text-sm">Please enter the access password to unlock the kiosk interface.</p>
          </div>

          {allowlistEnabled && (
            <div className="mb-8 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 group transition-all hover:bg-white hover:shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Device Identity</div>
                  <div className="mt-1 font-black text-slate-900 text-xs break-all">{deviceId}</div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${deviceAllowed ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                    <div className="text-[11px] font-bold text-slate-500">
                      Status:{' '}
                      <span className="text-slate-800">
                        {deviceStatus === 'checking' && 'Verifying…'}
                        {deviceStatus === 'ok' && (deviceAllowed ? 'Authorized' : 'Pending Approval')}
                        {deviceStatus === 'offline' && (deviceAllowed ? 'Authorized (Cached)' : 'Offline')}
                        {deviceStatus === 'skipped' && 'Public Mode'}
                      </span>
                    </div>
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
                  className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-90 transition-all shadow-sm"
                  title="Copy Device ID"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              </div>

              {!deviceAllowed && deviceStatus !== 'checking' && (
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={requestAccess}
                    className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black active:scale-95 transition-all shadow-lg shadow-slate-900/10"
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
                <div className="mt-4 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  Request sent. Waiting for administrator approval.
                </div>
              )}
            </div>
          )}

          {showConfigHint && (
            <div className="mb-8 text-[11px] font-bold text-amber-800 bg-amber-50/50 border border-amber-200 rounded-2xl px-5 py-4">
              <span className="opacity-60">Configuration Note:</span><br/>
              No password found in env. Use default: <span className="font-black text-amber-900">0000</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="relative group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="w-full bg-slate-50 px-6 py-5 rounded-[1.25rem] border-2 border-transparent outline-none focus:border-blue-500/20 focus:bg-white focus:ring-4 focus:ring-blue-500/5 text-center text-4xl tracking-[0.6em] font-black text-slate-900 transition-all placeholder:text-slate-200"
                autoFocus
                required
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="group relative w-full bg-blue-600 text-white font-black py-5 rounded-[1.25rem] hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-600/20 uppercase tracking-[0.25em] text-xs disabled:opacity-60 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {busy ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authorizing…
                  </>
                ) : (
                  <>
                    Unlock Kiosk
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          {error && (
            <div className="mt-6 text-[12px] font-bold text-red-700 bg-red-50 border border-red-100 rounded-2xl px-5 py-4 flex items-center gap-3 animate-head-shake">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <div className="mt-10 text-center">
            <div className="inline-block px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Indus University Kiosk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
