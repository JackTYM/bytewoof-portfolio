<script setup lang="ts">
import { getStroke } from 'perfect-freehand'
import type { GuestEntry } from '~/content/site'

const entries = ref<GuestEntry[]>([])
const name = ref('')
const msg = ref('')
const pending = ref(false)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const overlayCanvasRef = ref<HTMLCanvasElement | null>(null)
const zoomed = ref(false)
let drew = false

const CANVAS_RATIOS = [{ label: '4:3', value: '4/3' }, { label: '16:9', value: '16/9' }]
const canvasRatio = ref('4/3')
const PALETTE = ['#3AA0DA', '#E2557B', '#E8A33D', '#3FB27A', '#7A5CD0', '#2A2A2A']
const brushColor = ref(PALETTE[0])
const SIZES = [{ label: 'S', w: 4 }, { label: 'M', w: 10 }, { label: 'L', w: 20 }]
const brushSize = ref(SIZES[1].w)
const brushOpacity = ref(1)
const erasing = ref(false)
const smoothing = ref(true)

let mainCtx: CanvasRenderingContext2D | null = null
let mainOff: HTMLCanvasElement | null = null
let mainCleanup: (() => void) | null = null
let overlayCleanup: (() => void) | null = null

async function loadEntries() {
  try {
    const data = await $fetch<GuestEntry[]>('/api/guestbook')
    entries.value = data
  } catch {}
}

function getSvgPath(pts: number[][]): string {
  if (!pts.length) return ''
  const d: (string | number)[] = ['M', pts[0][0], pts[0][1], 'Q']
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[i]
    const [x1, y1] = pts[(i + 1) % pts.length]
    d.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
  }
  d.push('Z')
  return d.join(' ')
}

function ratioH(w: number, ratio: string): number {
  const [a, b] = ratio.split('/').map(Number)
  return b ? Math.round(w * b / a) : w
}

function setupDrawing(c: HTMLCanvasElement, copyFrom?: HTMLCanvasElement | null, forceH?: number) {
  const rect = c.getBoundingClientRect()
  const w = Math.round(rect.width)
  const h = forceH ?? Math.round(rect.height)
  if (w < 2 || h < 2) return null

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  c.width = w * dpr; c.height = h * dpr
  const ctx = c.getContext('2d')!
  ctx.scale(dpr, dpr)

  const off = document.createElement('canvas')
  off.width = c.width; off.height = c.height
  const offCtx = off.getContext('2d')!

  if (copyFrom && copyFrom.width > 0) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.drawImage(copyFrom, 0, 0, c.width, c.height)
    ctx.restore()
    offCtx.drawImage(copyFrom, 0, 0, c.width, c.height)
  }

  let pts: Array<[number, number, number]> = []
  let down = false

  const pos = (e: PointerEvent) => {
    const r = c.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const commit = () => {
    offCtx.clearRect(0, 0, off.width, off.height)
    offCtx.drawImage(c, 0, 0)
  }

  const restore = () => {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, c.width, c.height)
    ctx.drawImage(off, 0, 0)
    ctx.restore()
  }

  const drawStroke = (points: Array<[number, number, number]>) => {
    const stroke = getStroke(points, {
      size: brushSize.value,
      thinning: erasing.value ? 0 : 0.5,
      smoothing: smoothing.value ? 0.5 : 0,
      streamline: smoothing.value ? 0.5 : 0,
    })
    if (!stroke.length) return
    const path = new Path2D(getSvgPath(stroke))
    ctx.save()
    ctx.globalAlpha = brushOpacity.value
    ctx.globalCompositeOperation = erasing.value ? 'destination-out' : 'source-over'
    ctx.fillStyle = brushColor.value
    ctx.fill(path)
    ctx.restore()
  }

  const onDown = (e: PointerEvent) => {
    down = true
    const p = pos(e)
    pts = [[p.x, p.y, e.pressure || 0.5]]
    try { c.setPointerCapture(e.pointerId) } catch {}
    restore(); drawStroke(pts)
    drew = true; e.preventDefault()
  }

  const onMove = (e: PointerEvent) => {
    if (!down) return
    const p = pos(e)
    pts.push([p.x, p.y, e.pressure || 0.5])
    restore(); drawStroke(pts)
  }

  const onUp = () => {
    if (!down) return
    down = false; commit(); pts = []
  }

  c.addEventListener('pointerdown', onDown)
  c.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)

  return {
    ctx, off,
    cleanup: () => {
      c.removeEventListener('pointerdown', onDown)
      c.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    },
  }
}

function initDoodle() {
  const c = canvasRef.value
  if (!c) return
  const w = Math.round(c.getBoundingClientRect().width)
  if (w < 2) { setTimeout(initDoodle, 250); return }
  const result = setupDrawing(c, null, ratioH(w, canvasRatio.value))
  if (!result) { setTimeout(initDoodle, 250); return }
  mainCtx = result.ctx; mainOff = result.off; mainCleanup = result.cleanup
  drew = false
}

function clearDoodle() {
  const c = canvasRef.value
  if (c && mainCtx) {
    mainCtx.save(); mainCtx.setTransform(1, 0, 0, 1, 0, 0)
    mainCtx.clearRect(0, 0, c.width, c.height); mainCtx.restore()
  }
  if (mainOff) mainOff.getContext('2d')!.clearRect(0, 0, mainOff.width, mainOff.height)
  const oc = overlayCanvasRef.value
  if (oc) {
    const octx = oc.getContext('2d')
    if (octx) { octx.save(); octx.setTransform(1,0,0,1,0,0); octx.clearRect(0,0,oc.width,oc.height); octx.restore() }
  }
  drew = false
}

function openZoom() {
  zoomed.value = true
  nextTick(() => {
    const oc = overlayCanvasRef.value
    if (!oc) return
    const result = setupDrawing(oc, canvasRef.value)
    if (!result) return
    overlayCleanup = result.cleanup
  })
}

function closeZoom() {
  const oc = overlayCanvasRef.value
  const sc = canvasRef.value
  if (oc && sc && mainCtx) {
    mainCtx.save(); mainCtx.setTransform(1, 0, 0, 1, 0, 0)
    mainCtx.clearRect(0, 0, sc.width, sc.height)
    mainCtx.drawImage(oc, 0, 0, sc.width, sc.height)
    mainCtx.restore()
    if (mainOff) {
      const oCtx = mainOff.getContext('2d')!
      oCtx.clearRect(0, 0, mainOff.width, mainOff.height)
      oCtx.drawImage(oc, 0, 0, mainOff.width, mainOff.height)
    }
  }
  if (overlayCleanup) { overlayCleanup(); overlayCleanup = null }
  zoomed.value = false
}

async function signGuest(e: Event) {
  e.preventDefault()
  const trimName = name.value.trim() || 'anon'
  const trimMsg = msg.value.trim()
  if (!trimMsg) return

  let doodle: string | undefined
  try {
    if (drew && canvasRef.value) doodle = canvasRef.value.toDataURL('image/png')
  } catch {}

  try {
    await $fetch('/api/guestbook', {
      method: 'POST',
      body: { name: trimName.slice(0, 40), message: trimMsg.slice(0, 280), doodle },
    })
    pending.value = true
    name.value = ''; msg.value = ''
    clearDoodle()
    setTimeout(loadEntries, 1200)
  } catch {}
}

watch(canvasRatio, () => {
  const c = canvasRef.value
  if (!c) return
  const snapshot = drew && mainCtx ? c.toDataURL() : null
  if (mainCleanup) { mainCleanup(); mainCleanup = null }
  const w = Math.round(c.getBoundingClientRect().width)
  const h = ratioH(w, canvasRatio.value)
  const result = setupDrawing(c, null, h)
  if (!result) return
  mainCtx = result.ctx; mainOff = result.off; mainCleanup = result.cleanup
  if (snapshot) {
    const img = new Image()
    img.onload = () => { mainCtx!.drawImage(img, 0, 0, w, h) }
    img.src = snapshot
  }
})

onMounted(() => { loadEntries(); initDoodle() })
onUnmounted(() => { if (mainCleanup) mainCleanup() })
</script>

<template>
  <div style="border:2.5px solid var(--line-ink); border-radius:18px; background:var(--surface-card); box-shadow:4px 4px 0 var(--line-ink); padding:18px;">
    <!-- header -->
    <div style="display:flex; align-items:center; gap:9px; margin-bottom:12px;">
      <span style="width:32px;height:32px;flex:none;display:flex;align-items:center;justify-content:center;border:2.5px solid var(--line-ink);border-radius:9px;background:var(--green-400);color:#143D12;">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z"/></svg>
      </span>
      <h3 style="font-family:var(--font-display); font-weight:800; font-size:17px; color:var(--text-strong); margin:0;">sign the guestbook</h3>
    </div>

    <!-- form -->
    <form @submit="signGuest" style="display:flex; flex-direction:column; gap:9px; margin-bottom:13px;">
      <div style="display:flex; gap:9px; flex-wrap:wrap;">
        <input
          v-model="name"
          placeholder="your name"
          aria-label="your name"
          :disabled="pending"
          style="flex:1; min-width:110px; font-family:var(--font-body); font-weight:600; font-size:14px; padding:9px 12px; border:2.5px solid var(--line-ink); border-radius:11px; background:var(--surface-sunken); color:var(--text-strong); outline:none;"
        >
        <input
          v-model="msg"
          placeholder="leave a note…"
          aria-label="your message"
          :disabled="pending"
          style="flex:2; min-width:150px; font-family:var(--font-body); font-weight:600; font-size:14px; padding:9px 12px; border:2.5px solid var(--line-ink); border-radius:11px; background:var(--surface-sunken); color:var(--text-strong); outline:none;"
        >
      </div>

      <!-- canvas + expand -->
      <div style="position:relative;">
        <canvas
          ref="canvasRef"
          aria-label="draw an optional doodle"
          :style="`width:100%; aspect-ratio:${canvasRatio}; max-height:260px; border:2.5px dashed var(--line-soft); border-radius:11px; background:#FFFCF6; touch-action:none; cursor:crosshair; display:block;`"
        ></canvas>
        <button
          type="button"
          @click="openZoom"
          title="expand canvas"
          aria-label="open full-screen drawing canvas"
          style="position:absolute; top:8px; right:8px; width:28px; height:28px; display:flex; align-items:center; justify-content:center; cursor:pointer; border:2px solid var(--line-ink); border-radius:8px; background:var(--surface-card); color:var(--text-muted);"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" style="width:14px;height:14px">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </button>
      </div>

      <!-- toolbar row 1: colors -->
      <div style="display:flex; align-items:center; gap:5px; flex-wrap:wrap; padding:2px 0;">
        <!-- palette swatches -->
        <button
          v-for="color in PALETTE" :key="color"
          type="button"
          @click="brushColor = color; erasing = false"
          :aria-label="`draw in ${color}`"
          :style="`width:22px; height:22px; flex:none; border-radius:50%; background:${color}; cursor:pointer; border:2px solid transparent; outline:${!erasing && brushColor === color ? '2.5px solid var(--line-ink)' : 'none'}; outline-offset:2px;`"
        ></button>
        <!-- custom color picker swatch -->
        <div style="position:relative; width:22px; height:22px; flex:none;">
          <input
            type="color"
            :value="brushColor"
            @input="(e) => { brushColor = (e.target as HTMLInputElement).value; erasing = false }"
            aria-label="pick custom color"
            style="position:absolute; inset:0; width:100%; height:100%; opacity:0; cursor:pointer; border:none; padding:0; border-radius:50%;"
          >
          <span
            aria-hidden="true"
            :style="`position:absolute; inset:0; border-radius:50%; background:${!PALETTE.includes(brushColor) && !erasing ? brushColor : 'conic-gradient(red,yellow,lime,cyan,blue,magenta,red)'}; border:2px solid var(--line-soft); outline:${!erasing && !PALETTE.includes(brushColor) ? '2.5px solid var(--line-ink)' : 'none'}; outline-offset:2px; pointer-events:none;`"
          ></span>
        </div>
      </div>

      <!-- toolbar row 2: tools -->
      <div style="display:flex; align-items:center; gap:5px; flex-wrap:wrap; padding:2px 0;">
        <!-- canvas ratio -->
        <button
          v-for="r in CANVAS_RATIOS" :key="r.label"
          type="button"
          @click="canvasRatio = r.value"
          :style="`min-width:30px; height:22px; padding:0 6px; cursor:pointer; font-family:var(--font-mono); font-weight:700; font-size:10px; border-radius:6px; border:2px solid var(--line-ink); background:${canvasRatio === r.value ? 'var(--ink-950)' : 'var(--surface-card)'}; color:${canvasRatio === r.value ? 'var(--cream-100)' : 'var(--text-muted)'};`"
        >{{ r.label }}</button>

        <span style="width:1px; height:16px; flex:none; background:var(--line-hairline); margin:0 2px;"></span>

        <!-- size -->
        <button
          v-for="sz in SIZES" :key="sz.label"
          type="button"
          @click="brushSize = sz.w"
          :style="`min-width:26px; height:22px; padding:0 6px; cursor:pointer; font-family:var(--font-mono); font-weight:700; font-size:11px; border-radius:6px; border:2px solid var(--line-ink); background:${brushSize === sz.w ? 'var(--ink-950)' : 'var(--surface-card)'}; color:${brushSize === sz.w ? 'var(--cream-100)' : 'var(--text-muted)'};`"
        >{{ sz.label }}</button>

        <span style="width:1px; height:16px; flex:none; background:var(--line-hairline); margin:0 2px;"></span>

        <!-- opacity -->
        <input
          type="range" min="0.05" max="1" step="0.05"
          v-model.number="brushOpacity"
          aria-label="opacity"
          style="width:60px; cursor:pointer; accent-color:var(--byte-blue); flex:none;"
        >

        <span style="width:1px; height:16px; flex:none; background:var(--line-hairline); margin:0 2px;"></span>

        <!-- eraser -->
        <button
          type="button"
          @click="erasing = !erasing"
          aria-label="eraser"
          :style="`width:26px; height:22px; padding:0; display:flex; align-items:center; justify-content:center; cursor:pointer; border-radius:6px; border:2px solid var(--line-ink); background:${erasing ? 'var(--ink-950)' : 'var(--surface-card)'}; color:${erasing ? 'var(--cream-100)' : 'var(--text-muted)'};`"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px">
            <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/>
          </svg>
        </button>

        <!-- smoothing -->
        <button
          type="button"
          @click="smoothing = !smoothing"
          aria-label="toggle smoothing"
          :style="`min-width:36px; height:22px; padding:0 8px; cursor:pointer; font-family:var(--font-mono); font-weight:700; font-size:10px; border-radius:6px; border:2px solid var(--line-ink); background:${smoothing ? 'var(--ink-950)' : 'var(--surface-card)'}; color:${smoothing ? 'var(--cream-100)' : 'var(--text-muted)'};`"
        >~</button>

        <!-- clear -->
        <button
          type="button"
          @click="clearDoodle"
          style="min-width:36px; height:22px; padding:0 8px; cursor:pointer; font-family:var(--font-mono); font-weight:700; font-size:11px; color:var(--text-muted); border:2px solid var(--line-ink); border-radius:6px; background:var(--surface-card);"
        >clr</button>
      </div>

      <!-- fullscreen overlay -->
      <Teleport to="body">
        <div
          v-if="zoomed"
          style="position:fixed; inset:0; z-index:200; display:flex; flex-direction:column; background:color-mix(in srgb, var(--ink-950) 92%, transparent); backdrop-filter:blur(4px); padding:16px;"
          @keydown.esc="closeZoom"
        >
          <!-- overlay toolbar -->
          <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:10px; flex-wrap:wrap;">
            <span style="font-family:var(--font-display); font-weight:800; font-size:16px; color:var(--cream-100);">doodle me something</span>
            <div style="display:flex; align-items:center; gap:5px; flex-wrap:wrap;">
              <!-- palette -->
              <button
                v-for="color in PALETTE" :key="color"
                type="button"
                @click="brushColor = color; erasing = false"
                :style="`width:22px; height:22px; flex:none; border-radius:50%; background:${color}; cursor:pointer; border:2px solid transparent; outline:${!erasing && brushColor === color ? '2.5px solid #FFF8EE' : 'none'}; outline-offset:2px;`"
              ></button>
              <!-- custom color -->
              <div style="position:relative; width:22px; height:22px; flex:none;">
                <input
                  type="color"
                  :value="brushColor"
                  @input="(e) => { brushColor = (e.target as HTMLInputElement).value; erasing = false }"
                  aria-label="pick custom color"
                  style="position:absolute; inset:0; width:100%; height:100%; opacity:0; cursor:pointer; border:none; padding:0; border-radius:50%;"
                >
                <span
                  aria-hidden="true"
                  :style="`position:absolute; inset:0; border-radius:50%; background:${!PALETTE.includes(brushColor) && !erasing ? brushColor : 'conic-gradient(red,yellow,lime,cyan,blue,magenta,red)'}; border:2px solid rgba(255,255,255,.3); outline:${!erasing && !PALETTE.includes(brushColor) ? '2.5px solid #FFF8EE' : 'none'}; outline-offset:2px; pointer-events:none;`"
                ></span>
              </div>

              <span style="width:1px; height:16px; flex:none; background:rgba(255,255,255,.2); margin:0 2px;"></span>

              <!-- size -->
              <button
                v-for="sz in SIZES" :key="sz.label"
                type="button"
                @click="brushSize = sz.w"
                :style="`min-width:26px; height:24px; padding:0 6px; cursor:pointer; font-family:var(--font-mono); font-weight:700; font-size:11px; border-radius:7px; border:2px solid rgba(255,255,255,.3); background:${brushSize === sz.w ? '#FFF8EE' : 'transparent'}; color:${brushSize === sz.w ? 'var(--ink-950)' : 'var(--cream-100)'};`"
              >{{ sz.label }}</button>

              <span style="width:1px; height:16px; flex:none; background:rgba(255,255,255,.2); margin:0 2px;"></span>

              <!-- opacity -->
              <input
                type="range" min="0.05" max="1" step="0.05"
                v-model.number="brushOpacity"
                aria-label="opacity"
                style="width:60px; cursor:pointer; accent-color:#FFF8EE; flex:none;"
              >

              <span style="width:1px; height:16px; flex:none; background:rgba(255,255,255,.2); margin:0 2px;"></span>

              <!-- eraser -->
              <button
                type="button"
                @click="erasing = !erasing"
                aria-label="eraser"
                :style="`width:26px; height:24px; padding:0; display:flex; align-items:center; justify-content:center; cursor:pointer; border-radius:7px; border:2px solid rgba(255,255,255,.3); background:${erasing ? '#FFF8EE' : 'transparent'}; color:${erasing ? 'var(--ink-950)' : 'var(--cream-100)'};`"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px">
                  <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/>
                </svg>
              </button>

              <!-- smoothing -->
              <button
                type="button"
                @click="smoothing = !smoothing"
                aria-label="toggle smoothing"
                :style="`min-width:36px; height:24px; padding:0 8px; cursor:pointer; font-family:var(--font-mono); font-weight:700; font-size:10px; border-radius:7px; border:2px solid rgba(255,255,255,.3); background:${smoothing ? '#FFF8EE' : 'transparent'}; color:${smoothing ? 'var(--ink-950)' : 'var(--cream-100)'};`"
              >~</button>

              <!-- clear -->
              <button
                type="button"
                @click="clearDoodle"
                style="min-width:36px; height:24px; padding:0 8px; cursor:pointer; font-family:var(--font-mono); font-weight:700; font-size:11px; border:2px solid rgba(255,255,255,.3); border-radius:7px; background:transparent; color:var(--cream-100);"
              >clr</button>

              <!-- done -->
              <button
                type="button"
                @click="closeZoom"
                style="padding:5px 16px; cursor:pointer; font-family:var(--font-body); font-weight:800; font-size:13px; color:#5A1F30; border:2.5px solid var(--line-ink); border-radius:10px; background:var(--blush-500); box-shadow:2px 2px 0 var(--line-ink);"
              >done ✓</button>
            </div>
          </div>

          <canvas
            ref="overlayCanvasRef"
            aria-label="full-screen drawing canvas"
            style="display:block; width:min(100%,calc(100vh - 140px)); aspect-ratio:1; align-self:center; flex:none; border:2.5px dashed rgba(255,255,255,.2); border-radius:14px; background:#FFFCF6; touch-action:none; cursor:crosshair;"
          ></canvas>
        </div>
      </Teleport>

      <div style="display:flex; align-items:center; justify-content:space-between; gap:9px; flex-wrap:wrap;">
        <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted);">↑ optional: doodle me something</span>
        <button v-if="!pending" type="submit" class="byte-btn byte-btn--blush byte-btn--sm">sign »</button>
        <span v-else style="font-family:var(--font-mono); font-size:12px; color:var(--text-muted);">thanks — your note is pending approval ♥</span>
      </div>
    </form>

    <!-- entries -->
    <div style="display:flex; flex-direction:column; gap:12px; max-height:420px; overflow:auto;">
      <div
        v-for="entry in entries"
        :key="entry.id"
        style="border-top:2px dashed var(--line-hairline); padding-top:10px;"
      >
        <div style="margin-bottom:6px;">
          <span style="font-family:var(--font-mono); font-weight:700; font-size:12.5px; color:var(--text-link);">{{ entry.name }}</span>
          <span style="font-size:13.5px; color:var(--text-body);"> — {{ entry.message }}</span>
        </div>
        <img
          v-if="entry.doodle"
          :src="entry.doodle"
          :alt="`doodle by ${entry.name}`"
          style="width:100%; height:auto; border:2px solid var(--line-ink); border-radius:10px; background:#FFF8EE; display:block;"
        >
      </div>
    </div>
  </div>
</template>
