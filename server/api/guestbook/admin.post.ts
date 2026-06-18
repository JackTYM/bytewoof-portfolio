/* POST /api/guestbook/admin - approve or reject a pending entry (admin only).
 * Requires header: x-admin-token matching env.GUESTBOOK_ADMIN_TOKEN
 * Body: { id: string, action: 'approve' | 'reject' }
 *
 * approve: moves entry from gb:pending:<id> to gb:approved array
 * reject:  deletes gb:pending:<id>
 */
import type { GuestEntry } from '~/app/content/site'

export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env
  const token = env?.GUESTBOOK_ADMIN_TOKEN as string | undefined
  const provided = getHeader(event, 'x-admin-token')

  if (!token || !provided || provided !== token) {
    throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  }

  const body = await readBody(event) as { id?: string; action?: 'approve' | 'reject' }
  const { id, action } = body

  if (!id || (action !== 'approve' && action !== 'reject')) {
    throw createError({ statusCode: 400, statusMessage: 'id and action (approve|reject) required' })
  }

  const kv: KVNamespace | undefined = env?.BOOPS_KV
  if (!kv) {
    throw createError({ statusCode: 503, statusMessage: 'KV not available' })
  }

  // The pending key is the id itself (it starts with 'gb:pending:')
  const pendingKey = id.startsWith('gb:pending:') ? id : `gb:pending:${id}`
  const raw = await kv.get(pendingKey)

  if (!raw) {
    throw createError({ statusCode: 404, statusMessage: 'pending entry not found' })
  }

  if (action === 'reject') {
    await kv.delete(pendingKey)
    return { ok: true, action: 'rejected' }
  }

  // Approve: append to gb:approved array
  let approved: GuestEntry[] = []
  try {
    const existing = await kv.get('gb:approved')
    if (existing) approved = JSON.parse(existing)
  } catch {}

  const entry = JSON.parse(raw) as GuestEntry
  approved = [entry, ...approved].slice(0, 200) // cap at 200 entries

  await kv.put('gb:approved', JSON.stringify(approved))
  await kv.delete(pendingKey)

  return { ok: true, action: 'approved' }
})
