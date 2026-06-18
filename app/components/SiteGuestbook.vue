<script setup lang="ts">
import { GUESTBOOK_DEFAULTS, type GuestEntry } from '~/content/site'

const entries = ref<GuestEntry[]>(GUESTBOOK_DEFAULTS)
const name = ref('')
const msg = ref('')
const pending = ref(false)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const overlayCanvasRef = ref<HTMLCanvasElement | null>(null)
const zoomed = ref(false)
const canvasRatio = ref(4)
let dctx: CanvasRenderingContext2D | null = null
let overlayCtx: CanvasRenderingContext2D | null = null
let drew = false
let doodleCleanup: (() => void) | null = null

const PALETTE = ['#3AA0DA', '#E2557B', '#E8A33D', '#3FB27A', '#7A5CD0', '#2A2A2A', '#FFFFFF']
const brushColor = ref(PALETTE[0])
const SIZES = [{ label: 'S', w: 2 }, { label: 'M', w: 4 }, { label: 'L', w: 8 }]
const brushSize = ref(SIZES[1].w)

async function loadEntries() {
  try {
    const data = await $fetch<GuestEntry[]>('/api/guestbook')
    if (data.length) entries.value = data
  } catch {}
}

function initDoodle() {
  const c = canvasRef.value
  if (!c) return
  const rect = c.getBoundingClientRect()
  const w = Math.round(rect.width), h = Math.round(rect.height)
  if (w < 2 || h < 2) { setTimeout(initDoodle, 250); return }
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  c.width = w * dpr; c.height = h * dpr
  const ctx = c.getContext('2d')!
  ctx.scale(dpr, dpr)
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'
  dctx = ctx; drew = false

  let drawing = false
  let last = { x: 0, y: 0 }
  const pos = (e: PointerEvent) => {
    const r = c.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  const down = (e: PointerEvent) => {
    drawing = true; last = pos(e)
    try { c.setPointerCapture(e.pointerId) } catch {}
    ctx.strokeStyle = brushColor.value
    ctx.fillStyle = brushColor.value
    ctx.lineWidth = brushSize.value
    ctx.beginPath(); ctx.arc(last.x, last.y, brushSize.value / 2, 0, 7)
    ctx.fill()
    drew = true; e.preventDefault()
  }
  const move = (e: PointerEvent) => {
    if (!drawing) return
    const p = pos(e)
    ctx.strokeStyle = brushColor.value
    ctx.lineWidth = brushSize.value
    ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke()
    last = p
  }
  const up = () => { drawing = false }

  c.addEventListener('pointerdown', down)
  c.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
  doodleCleanup = () => {
    c.removeEventListener('pointerdown', down)
    c.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
  }
}

function clearDoodle() {
  const c = canvasRef.value
  if (!c || !dctx) return
  dctx.save(); dctx.setTransform(1, 0, 0, 1, 0, 0); dctx.clearRect(0, 0, c.width, c.height); dctx.restore()
  if (overlayCtx && overlayCanvasRef.value) {
    const oc = overlayCanvasRef.value
    overlayCtx.save(); overlayCtx.setTransform(1,0,0,1,0,0); overlayCtx.clearRect(0,0,oc.width,oc.height); overlayCtx.restore()
  }
  drew = false
}

function openZoom() {
  const sc = canvasRef.value
  if (sc) canvasRatio.value = sc.offsetWidth / sc.offsetHeight
  zoomed.value = true
  nextTick(() => {
    const oc = overlayCanvasRef.value
    if (!oc) return
    const rect = oc.getBoundingClientRect()
    const w = Math.round(rect.width), h = Math.round(rect.height)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    oc.width = w * dpr; oc.height = h * dpr
    const ctx = oc.getContext('2d')!
    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    overlayCtx = ctx

    const sc = canvasRef.value
    if (sc && sc.width > 0) {
      ctx.save(); ctx.setTransform(1,0,0,1,0,0)
      ctx.drawImage(sc, 0, 0, oc.width, oc.height)
      ctx.restore()
    }

    let drawing = false
    let last = { x: 0, y: 0 }
    const pos = (e: PointerEvent) => {
      const r = oc.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const down = (e: PointerEvent) => {
      drawing = true; last = pos(e)
      try { oc.setPointerCapture(e.pointerId) } catch {}
      ctx.strokeStyle = brushColor.value
      ctx.fillStyle = brushColor.value
      ctx.lineWidth = brushSize.value + 1
      ctx.beginPath(); ctx.arc(last.x, last.y, (brushSize.value + 1) / 2, 0, 7)
      ctx.fill()
      drew = true; e.preventDefault()
    }
    const move = (e: PointerEvent) => {
      if (!drawing) return
      const p = pos(e)
      ctx.strokeStyle = brushColor.value
      ctx.lineWidth = brushSize.value + 1
      ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke()
      last = p
    }
    const up = () => { drawing = false }
    oc.addEventListener('pointerdown', down)
    oc.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  })
}

function closeZoom() {
  const oc = overlayCanvasRef.value
  const sc = canvasRef.value
  if (oc && sc && dctx) {
    dctx.save(); dctx.setTransform(1,0,0,1,0,0)
    dctx.clearRect(0,0,sc.width,sc.height)
    dctx.drawImage(oc, 0, 0, sc.width, sc.height)
    dctx.restore()
  }
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
    name.value = ''
    msg.value = ''
    clearDoodle()
    setTimeout(loadEntries, 1200)
  } catch {}
}

onMounted(() => {
  loadEntries()
  initDoodle()
})

onUnmounted(() => {
  if (doodleCleanup) doodleCleanup()
})
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

      <div style="display:flex; align-items:stretch; gap:9px;">
        <div style="position:relative; flex:1;">
          <canvas
            ref="canvasRef"
            aria-label="draw an optional doodle"
            style="width:100%; height:84px; border:2.5px dashed var(--line-soft); border-radius:11px; background:var(--surface-sunken); touch-action:none; cursor:crosshair; display:block;"
          ></canvas>
          <button
            type="button"
            @click="openZoom"
            title="expand canvas"
            aria-label="open full-screen drawing canvas"
            style="position:absolute; top:6px; right:6px; width:26px; height:26px; display:flex; align-items:center; justify-content:center; cursor:pointer; border:2px solid var(--line-ink); border-radius:7px; background:var(--surface-card); color:var(--text-muted);"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" style="width:14px;height:14px">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </button>
        </div>
        <button
          type="button"
          @click="clearDoodle"
          title="clear doodle"
          style="flex:none; align-self:stretch; width:54px; cursor:pointer; font-family:var(--font-mono); font-weight:700; font-size:11px; color:var(--text-muted); border:2.5px solid var(--line-ink); border-radius:11px; background:var(--surface-card);"
        >clear</button>
      </div>

      <!-- color + brush toolbar -->
      <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; padding:2px 0;">
        <button
          v-for="color in PALETTE"
          :key="color"
          type="button"
          @click="brushColor = color"
          :aria-label="`draw in ${color}`"
          :style="`width:20px; height:20px; flex:none; border-radius:50%; background:${color}; cursor:pointer; border:${color === '#FFFFFF' ? '2px solid var(--line-soft)' : '2px solid transparent'}; outline:${brushColor === color ? '2.5px solid var(--line-ink)' : 'none'}; outline-offset:2px;`"
        ></button>
        <span style="width:1px; height:16px; flex:none; background:var(--line-hairline); margin:0 2px;"></span>
        <button
          v-for="sz in SIZES"
          :key="sz.label"
          type="button"
          @click="brushSize = sz.w"
          :style="`min-width:28px; height:22px; padding:0 7px; cursor:pointer; font-family:var(--font-mono); font-weight:700; font-size:11px; border-radius:6px; border:2px solid var(--line-ink); background:${brushSize === sz.w ? 'var(--ink-950)' : 'var(--surface-card)'}; color:${brushSize === sz.w ? 'var(--cream-100)' : 'var(--text-muted)'};`"
        >{{ sz.label }}</button>
      </div>

      <!-- full-screen doodle overlay -->
      <Teleport to="body">
        <div
          v-if="zoomed"
          style="position:fixed; inset:0; z-index:200; display:flex; flex-direction:column; background:color-mix(in srgb, var(--ink-950) 90%, transparent); backdrop-filter:blur(4px); padding:20px;"
          @keydown.esc="closeZoom"
        >
          <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:12px; flex-wrap:wrap;">
            <span style="font-family:var(--font-display); font-weight:800; font-size:17px; color:var(--cream-100);">doodle me something 🎨</span>
            <!-- color + size controls in overlay header -->
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <button
                v-for="color in PALETTE"
                :key="color"
                type="button"
                @click="brushColor = color"
                :aria-label="`draw in ${color}`"
                :style="`width:22px; height:22px; flex:none; border-radius:50%; background:${color}; cursor:pointer; border:${color === '#FFFFFF' ? '2px solid rgba(255,255,255,.4)' : '2px solid transparent'}; outline:${brushColor === color ? '2.5px solid #FFF8EE' : 'none'}; outline-offset:2px;`"
              ></button>
              <span style="width:1px; height:16px; flex:none; background:rgba(255,255,255,.2); margin:0 2px;"></span>
              <button
                v-for="sz in SIZES"
                :key="sz.label"
                type="button"
                @click="brushSize = sz.w"
                :style="`min-width:28px; height:24px; padding:0 7px; cursor:pointer; font-family:var(--font-mono); font-weight:700; font-size:11px; border-radius:7px; border:2px solid rgba(255,255,255,.3); background:${brushSize === sz.w ? '#FFF8EE' : 'transparent'}; color:${brushSize === sz.w ? 'var(--ink-950)' : 'var(--cream-100)'};`"
              >{{ sz.label }}</button>
              <span style="width:1px; height:16px; flex:none; background:rgba(255,255,255,.2); margin:0 2px;"></span>
              <button
                type="button"
                @click="clearDoodle"
                style="padding:5px 14px; cursor:pointer; font-family:var(--font-mono); font-weight:700; font-size:12px; color:var(--text-muted); border:2.5px solid var(--line-ink); border-radius:10px; background:var(--surface-card);"
              >clear</button>
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
            :style="`display:block; width:100%; max-height:calc(100vh - 120px); aspect-ratio:${canvasRatio}; border:2.5px dashed var(--line-soft); border-radius:14px; background:#FFFCF6; touch-action:none; cursor:crosshair;`"
          ></canvas>
        </div>
      </Teleport>

      <div style="display:flex; align-items:center; justify-content:space-between; gap:9px; flex-wrap:wrap;">
        <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted);">↑ optional: doodle me something</span>
        <button
          v-if="!pending"
          type="submit"
          class="byte-btn byte-btn--blush byte-btn--sm"
        >sign »</button>
        <span
          v-else
          style="font-family:var(--font-mono); font-size:12px; color:var(--text-muted);"
        >thanks — your note is pending approval ♥</span>
      </div>
    </form>

    <!-- entries -->
    <div style="display:flex; flex-direction:column; gap:10px; max-height:208px; overflow:auto;">
      <div
        v-for="entry in entries"
        :key="entry.id"
        style="border-top:2px dashed var(--line-hairline); padding-top:9px; display:flex; gap:10px; align-items:flex-start;"
      >
        <span v-if="entry.doodle" style="flex:none; width:58px; height:44px; border:2px solid var(--line-ink); border-radius:8px; overflow:hidden; background:#FFF8EE;">
          <img :src="entry.doodle" :alt="`doodle by ${entry.name}`" style="width:100%; height:100%; object-fit:contain; display:block;">
        </span>
        <span style="min-width:0;">
          <span style="font-family:var(--font-mono); font-weight:700; font-size:12.5px; color:var(--text-link);">{{ entry.name }}</span>
          <span style="font-size:13.5px; color:var(--text-body);"> — {{ entry.message }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
