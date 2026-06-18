/* Night-owl clock. Updates every 60s.
 * Buckets (24h):
 *   4–12  → asleep  "asleep · sleeping in"
 *  12–20  → awake   "awake · up and about"
 *  20–4   → wired   "wired · zoomies hours"
 */
export type ClockMood = 'asleep' | 'day' | 'wired'

const LABELS: Record<ClockMood, string> = {
  asleep: 'asleep · sleeping in',
  day:    'awake · up and about',
  wired:  'wired · zoomies hours',
}

export function useClock() {
  const mood = ref<ClockMood>('awake')
  const clockLabel = computed(() => LABELS[mood.value])

  function update() {
    const h = new Date().getHours()
    mood.value = h >= 20 || h < 4  ? 'wired'
               : h >= 4  && h < 12 ? 'asleep'
               : 'day'
  }

  let timer: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    update()
    timer = setInterval(update, 60_000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { mood, clockLabel }
}
