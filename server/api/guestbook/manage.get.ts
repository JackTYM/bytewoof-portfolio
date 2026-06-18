/* GET /api/guestbook/manage?token=<GUESTBOOK_ADMIN_TOKEN>
 * HTML admin page listing all approved guestbook entries with delete buttons. */

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env as Record<string, string> | undefined
  const adminToken = env?.GUESTBOOK_ADMIN_TOKEN
  const { token } = getQuery(event) as { token?: string }

  if (!adminToken || !token || token !== adminToken) {
    return new Response('<h1>unauthorized</h1>', { status: 401, headers: { 'Content-Type': 'text/html' } })
  }

  const kv: KVNamespace | undefined = event.context.cloudflare?.env?.BOOPS_KV
  const entries: Array<{ id: string; name: string; message: string; doodle?: string; ts: number }> = []

  if (kv) {
    const raw = await kv.get('gb:approved')
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        entries.push(...parsed)
      } catch {}
    }
  }

  const rows = entries.length === 0
    ? '<p style="color:#8a7461;text-align:center;padding:32px 0;">no approved entries yet.</p>'
    : entries.map((e, i) => `
      <div style="border:2px solid #5a4030;border-radius:14px;padding:18px 20px;margin-bottom:14px;background:#2a2014;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;">
          <div style="min-width:0;flex:1;">
            <div style="font-weight:700;font-size:15px;margin-bottom:4px;">${esc(e.name)}</div>
            <div style="color:#c0a882;font-size:14px;line-height:1.55;white-space:pre-wrap;word-break:break-word;">${esc(e.message)}</div>
            ${e.doodle ? `<img src="${e.doodle}" alt="doodle" style="max-width:180px;border-radius:8px;border:1.5px solid #5a4030;margin-top:10px;display:block;">` : ''}
            <div style="font-size:11px;color:#8a7461;font-family:monospace;margin-top:6px;">${new Date(e.ts).toLocaleString()}</div>
          </div>
          <form method="post" action="/api/guestbook/manage" style="flex:none;">
            <input type="hidden" name="token" value="${esc(token)}">
            <input type="hidden" name="index" value="${i}">
            <button type="submit" onclick="return confirm('delete this entry?')" style="padding:7px 14px;font-size:13px;font-weight:700;cursor:pointer;border-radius:10px;border:2px solid #5a4030;background:#1a1a1a;color:#e07070;">delete</button>
          </form>
        </div>
      </div>`).join('')

  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>guestbook management — byte</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif;background:#1a1a1a;color:#f0dcc4;padding:32px 20px;max-width:620px;margin:0 auto}h1{font-size:22px;font-weight:800;margin-bottom:6px}p.sub{color:#8a7461;font-size:13px;margin-bottom:24px}</style>
</head><body>
  <h1>approved entries (${entries.length})</h1>
  <p class="sub">byte guestbook admin — changes take effect immediately</p>
  ${rows}
</body></html>`, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
})
