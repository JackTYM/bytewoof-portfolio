/* GET /api/guestbook/review?id=<id>&sig=<sig>
 * Read-only review page — verifies HMAC signature then renders the entry with
 * Approve / Reject buttons. The GET itself is idempotent (Discord crawler-safe). */

function html(title: string, body: string, status = 200) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — byte guestbook</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:system-ui,sans-serif;background:#1a1a1a;color:#f0dcc4;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
  .card{background:#2a2014;border:2.5px solid #5a4030;border-radius:18px;padding:28px 32px;max-width:520px;width:100%;box-shadow:6px 6px 0 #0a0805}
  h1{font-size:22px;font-weight:800;margin-bottom:18px;color:#f0dcc4}
  .field{margin-bottom:14px}
  .label{font-size:11px;font-weight:700;color:#8a7461;font-family:monospace;margin-bottom:4px}
  .value{font-size:15px;line-height:1.55;white-space:pre-wrap;word-break:break-word}
  img{max-width:100%;border-radius:12px;border:2px solid #5a4030;margin-top:10px;display:block}
  .actions{display:flex;gap:12px;margin-top:22px}
  button{flex:1;padding:11px;font-size:14px;font-weight:800;cursor:pointer;border-radius:12px;border:2.5px solid #5a4030;transition:opacity .15s}
  .approve{background:#3AA0DA;color:#06283A}
  .reject{background:#2a2014;color:#8a7461}
  button:hover{opacity:.85}
  p{line-height:1.6;color:#8a7461}
</style>
</head><body><div class="card">${body}</div></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  )
}

export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env as Record<string, string> | undefined
  const secret = env?.GUESTBOOK_SIGNING_SECRET
  const kv: KVNamespace | undefined = event.context.cloudflare?.env?.BOOPS_KV

  const { id, sig } = getQuery(event) as { id?: string; sig?: string }

  if (!secret || !id || !sig || !await verifyToken(secret, id, sig)) {
    return html('invalid link', '<h1>invalid or expired link</h1><p>this link is not valid or has been tampered with.</p>', 401)
  }

  if (!kv) {
    return html('unavailable', '<h1>unavailable</h1><p>storage not configured.</p>', 503)
  }

  const raw = await kv.get(id)
  if (!raw) {
    return html('already handled', '<h1>already handled</h1><p>this entry was already approved or rejected (or it expired).</p>', 200)
  }

  const entry = JSON.parse(raw) as { name: string; message: string; doodle?: string; ts: number }
  const encId = encodeURIComponent(id)
  const encSig = encodeURIComponent(sig)

  const doodleHtml = entry.doodle
    ? `<div class="field"><div class="label">doodle</div><img src="${entry.doodle}" alt="doodle"></div>`
    : ''

  const formField = `<input type="hidden" name="id" value="${encId}"><input type="hidden" name="sig" value="${encSig}">`

  return html('review entry', `
    <h1>review guestbook entry</h1>
    <div class="field"><div class="label">name</div><div class="value">${escHtml(entry.name)}</div></div>
    <div class="field"><div class="label">message</div><div class="value">${escHtml(entry.message)}</div></div>
    ${doodleHtml}
    <div class="actions">
      <form method="post" action="/api/guestbook/review" style="flex:1">
        ${formField}<input type="hidden" name="action" value="approve">
        <button type="submit" class="approve">✓ approve</button>
      </form>
      <form method="post" action="/api/guestbook/review" style="flex:1">
        ${formField}<input type="hidden" name="action" value="reject">
        <button type="submit" class="reject">✕ reject</button>
      </form>
    </div>
  `)
})

function escHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
