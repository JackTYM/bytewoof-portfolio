/* Theme — light / dark. Attribute: data-byte-theme on <html> + <body>.
 * Storage key: byte.theme. Defaults to OS preference. */
export function useTheme() {
  const theme = useState<'light' | 'dark'>('theme', () => 'light')

  function apply(value: 'light' | 'dark') {
    if (import.meta.server) return
    document.documentElement.setAttribute('data-byte-theme', value)
    document.body.setAttribute('data-byte-theme', value)
    localStorage.setItem('byte.theme', value)
    theme.value = value
  }

  function init() {
    if (import.meta.server) return
    const stored = localStorage.getItem('byte.theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    apply(stored ?? (prefersDark ? 'dark' : 'light'))
  }

  function toggle() {
    apply(theme.value === 'dark' ? 'light' : 'dark')
  }

  return { theme, init, toggle }
}
