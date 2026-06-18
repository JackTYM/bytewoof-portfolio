/* GET /api/guestbook — returns approved guestbook entries.
 * Falls back to the default seed entries if KV has no approved entries yet.
 * Edge-cached 1h. */
import type { GuestEntry } from '~/app/content/site'

const DEFAULTS: GuestEntry[] = [
  { id: 'default-1', name: 'pixelfox', message: 'cute site!! booped you like 10 times 🐾', ts: 0 },
  { id: 'default-2', name: 'rootkit',  message: 'the terminal block is so you lol',          ts: 0 },
  { id: 'default-3', name: 'mossy',    message: 'tapped your card at the con — saved!',       ts: 0 },
]

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, stale-while-revalidate=600')

  const kv: KVNamespace | undefined = event.context.cloudflare?.env?.BOOPS_KV
  if (!kv) return DEFAULTS

  const raw = await kv.get('gb:approved')
  if (!raw) return DEFAULTS

  try {
    const entries = JSON.parse(raw) as GuestEntry[]
    return entries.length ? entries : DEFAULTS
  } catch {
    return DEFAULTS
  }
})
