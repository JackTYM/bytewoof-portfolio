/* Motion - animate / pause. Attribute: data-byte-motion on <html>.
 * Storage key: byte.motion. Defaults off when prefers-reduced-motion. */
export function useMotion() {
  const motionOn = useState<boolean>('motionOn', () => true)

  function apply(on: boolean) {
    if (import.meta.server) return
    document.documentElement.setAttribute('data-byte-motion', on ? 'on' : 'off')
    localStorage.setItem('byte.motion', on ? 'on' : 'off')
    motionOn.value = on
  }

  function init() {
    if (import.meta.server) return
    const stored = localStorage.getItem('byte.motion')
    const reducedPref = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (stored !== null) {
      apply(stored === 'on')
    } else {
      apply(!reducedPref)
    }
  }

  function toggle() {
    apply(!motionOn.value)
  }

  return { motionOn, init, toggle }
}
