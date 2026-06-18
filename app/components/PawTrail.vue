<script setup lang="ts">
const containerRef = ref<HTMLDivElement | null>(null)
let lastPaw = 0
let px = 0
let py = 0
const fine = import.meta.client && window.matchMedia('(pointer: fine)').matches

const PAW_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" style="width:100%;height:100%"><ellipse cx="6" cy="9.3" rx="2.05" ry="2.7"/><ellipse cx="11" cy="6.6" rx="2.15" ry="2.85"/><ellipse cx="16.4" cy="7.6" rx="2.05" ry="2.7"/><ellipse cx="19.2" cy="12.2" rx="1.75" ry="2.25"/><path d="M12 12.2c3.1 0 5.6 2.2 5.6 4.9 0 2.1-1.75 3.3-3.8 3.3-1.05 0-1.35-.42-1.8-.42s-.75.42-1.8.42c-2.05 0-3.8-1.2-3.8-3.3 0-2.7 2.5-4.9 5.6-4.9Z"/></svg>'

function spawnPaw(e: PointerEvent) {
  // Honor motion-off and pointer:coarse
  if (!fine) return
  if (document.documentElement.getAttribute('data-byte-motion') === 'off') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const now = performance.now()
  if (now - lastPaw < 55) return

  const dx = e.clientX - px
  const dy = e.clientY - py
  if (lastPaw > 0 && Math.hypot(dx, dy) < 20) return

  lastPaw = now
  px = e.clientX
  py = e.clientY

  const layer = containerRef.value
  if (!layer) return

  const rot = (Math.atan2(dy, dx) * 180 / Math.PI) + 90 + (Math.random() * 28 - 14)
  const isDark = document.documentElement.getAttribute('data-byte-theme') === 'dark'
  const col = isDark ? 'rgba(143,212,245,.78)' : 'rgba(110,74,52,.5)'

  const span = document.createElement('span')
  span.setAttribute('data-loop', '')
  span.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:22px;height:22px;pointer-events:none;color:${col};--pr:${rot}deg;z-index:90;animation:bytePaw .72s ease-out forwards`
  span.innerHTML = PAW_SVG
  layer.appendChild(span)
  setTimeout(() => span.remove(), 740)
}

onMounted(() => {
  window.addEventListener('pointermove', spawnPaw, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('pointermove', spawnPaw)
})
</script>

<template>
  <div
    ref="containerRef"
    aria-hidden="true"
    style="position:fixed; inset:0; pointer-events:none; z-index:90;"
  />
</template>
