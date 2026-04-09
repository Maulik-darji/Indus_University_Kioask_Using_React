export async function sha256Hex(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(String(input ?? ''));

  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);
  let hex = '';
  for (const b of bytes) hex += b.toString(16).padStart(2, '0');
  return hex;
}

