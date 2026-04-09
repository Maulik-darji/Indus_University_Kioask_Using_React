const SESSION_KEY = 'indus_kiosk_session_v1';

export function getKioskSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setKioskSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearKioskSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

export function isKioskSessionValid(session, currentDeviceId) {
  if (!session || typeof session !== 'object') return false;
  if (!session.token || typeof session.token !== 'string') return false;
  if (!session.deviceId || typeof session.deviceId !== 'string') return false;
  if (currentDeviceId && session.deviceId !== currentDeviceId) return false;
  return true;
}

