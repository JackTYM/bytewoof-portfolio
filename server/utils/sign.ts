/* HMAC-SHA256 signing helpers for stateless approval links.
 * Auto-imported by Nitro — no explicit import needed in server routes. */

const enc = (s: string) => new TextEncoder().encode(s)

function b64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64urlDecode(s: string): Uint8Array {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=')
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0))
}

async function importKey(secret: string) {
  return crypto.subtle.importKey(
    'raw', enc(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign', 'verify'],
  )
}

export async function signToken(secret: string, msg: string): Promise<string> {
  const key = await importKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, enc(msg))
  return b64url(sig)
}

export async function verifyToken(secret: string, msg: string, sig: string): Promise<boolean> {
  try {
    const key = await importKey(secret)
    return await crypto.subtle.verify('HMAC', key, b64urlDecode(sig), enc(msg))
  } catch {
    return false
  }
}
