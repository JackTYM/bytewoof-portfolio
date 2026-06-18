/* Boop counter — real KV-backed global total.
 * Strategy:
 *   - localStorage cache { total, ts } with 1h TTL to avoid re-hitting the edge
 *   - Optimistic local increments; batched flush via sendBeacon after 2s idle
 *   - bytesLabel uses binary units (KiB, MiB, GiB) matching the design
 */

const CACHE_KEY = 'byte.boops'
const CACHE_TTL = 3_600_000 // 1 hour in ms
const FLUSH_DELAY = 2_000   // 2 seconds

export function useBoops() {
  const total = useState<number>('boops.total', () => 0)
  const localDelta = ref(0)
  let flushTimer: ReturnType<typeof setTimeout> | null = null

  async function fetchTotal() {
    try {
      const data = await $fetch<{ total: number }>('/api/boops')
      total.value = data.total
      if (import.meta.client) {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ total: data.total, ts: Date.now() }))
      }
    } catch { /* offline — keep last value */ }
  }

  function boop() {
    total.value++
    localDelta.value++
    scheduleFlush()
  }

  function scheduleFlush() {
    if (flushTimer) clearTimeout(flushTimer)
    flushTimer = setTimeout(flush, FLUSH_DELAY)
  }

  function flush() {
    if (localDelta.value <= 0) return
    const delta = localDelta.value
    localDelta.value = 0
    const body = JSON.stringify({ delta })
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      navigator.sendBeacon('/api/boops', blob)
    } else {
      $fetch('/api/boops', { method: 'POST', body: { delta } }).catch(() => {})
    }
  }

  /** Binary (1024) unit label — B / KiB / MiB / GiB */
  function bytesLabel(n: number): string {
    if (n < 1024)                 return `${n} B`
    if (n < 1024 * 1024)          return `${(n / 1024).toFixed(1)} KiB`
    if (n < 1024 * 1024 * 1024)   return `${(n / 1024 / 1024).toFixed(2)} MiB`
    return `${(n / 1024 / 1024 / 1024).toFixed(2)} GiB`
  }

  onMounted(() => {
    // Try localStorage cache first
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (raw) {
        const cached = JSON.parse(raw) as { total: number; ts: number }
        if (Date.now() - cached.ts < CACHE_TTL) {
          total.value = cached.total
          return // Skip network fetch — cache is fresh
        }
      }
    } catch {}
    fetchTotal()
  })

  onBeforeUnmount(flush)

  return { total, boop, bytesLabel }
}
