const DEVICE_ID_KEY = 'indus_device_id_v1';

function generateDeviceId() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function getOrCreateDeviceId() {
  try {
    const existing = localStorage.getItem(DEVICE_ID_KEY);
    if (existing) return existing;
    const created = generateDeviceId();
    localStorage.setItem(DEVICE_ID_KEY, created);
    return created;
  } catch {
    return generateDeviceId();
  }
}

