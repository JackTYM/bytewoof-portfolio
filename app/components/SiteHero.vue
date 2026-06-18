<script setup lang="ts">
const emit = defineEmits<{ navigate: [id: string] }>()
const { total, boop, bytesLabel } = useBoops()
const { mood, clockLabel } = useClock()

/* Boop state */
const boopStreak = ref(0)
const isBooped = ref(false)
const reaction = ref<string | null>(null)
let boopTimer: ReturnType<typeof setTimeout> | null = null
let streakTimer: ReturnType<typeof setTimeout> | null = null
let popTimer: ReturnType<typeof setTimeout> | null = null

const boopAnimKey = ref(0)
interface Heart { id: number; left: number; top: number; size: number; rot: number }
const hearts = ref<Heart[]>([])
let heartId = 0

function reactionFor(streak: number) {
  if (streak <= 1) return 'eep—!'
  if (streak === 2) return 'o-oh, h-hi'
  if (streak <= 4) return 'hehe ♥'
  if (streak <= 7) return '*tail wag*'
  return 'i think i like youu ♥'
}

function spawnHearts() {
  const n = 1
  for (let i = 0; i < n; i++) {
    const id = ++heartId
    const h: Heart = {
      id,
      left: 30 + Math.random() * 40,
      top:  10 + Math.random() * 40,
      size: 14 + Math.random() * 14,
      rot:  (Math.random() - .5) * 40,
    }
    hearts.value.push(h)
    setTimeout(() => { hearts.value = hearts.value.filter(x => x.id !== id) }, 3100)
  }
}

function handleBoop() {
  boop()
  boopStreak.value++
  reaction.value = reactionFor(boopStreak.value)
  spawnHearts()
  if (boopTimer) clearTimeout(boopTimer)
  if (streakTimer) clearTimeout(streakTimer)
  if (popTimer) clearTimeout(popTimer)
  boopTimer = setTimeout(() => { reaction.value = null }, 4500)
  streakTimer = setTimeout(() => { boopStreak.value = 0 }, 4500)
  // Incrementing the key forces Vue to remount the span, which restarts the CSS animation
  // from frame 0 on every tap — nextTick/false→true doesn't work because the browser
  // batches both DOM writes into one frame and never sees the "no animation" state.
  boopAnimKey.value++
  isBooped.value = true
  popTimer = setTimeout(() => { isBooped.value = false }, 850)
}

/* Odometer: rolling digit strips */
interface OdoCell { sep?: true; digit?: true; d?: number; transform?: string }
const odo = computed<OdoCell[]>(() => {
  const str = total.value.toLocaleString('en-US')
  return [...str].map(ch => {
    if (ch === ',') return { sep: true }
    const d = Number(ch)
    return { digit: true, d, transform: `translateY(-${d}em)` }
  })
})

const bLabel = computed(() => bytesLabel(total.value))

/* Stars — same positions as the design */
const STARS = [
  { left: '8%',  top: '14%', size: 18, color: '#FFF3D8', anim: 'byteTwinkle 3.4s ease-in-out infinite' },
  { left: '22%', top: '8%',  size: 11, color: '#8FD4F5', anim: 'byteTwinkle 2.8s ease-in-out .6s infinite' },
  { left: '55%', top: '9%',  size: 13, color: '#FFF3D8', anim: 'byteTwinkle 3.9s ease-in-out 1.1s infinite' },
  { left: '71%', top: '16%', size: 16, color: '#8FD4F5', anim: 'byteFloatStar 5s ease-in-out infinite' },
  { left: '88%', top: '10%', size: 10, color: '#FFF3D8', anim: 'byteTwinkle 3.1s ease-in-out .3s infinite' },
  { left: '93%', top: '34%', size: 13, color: '#FFF3D8', anim: 'byteTwinkle 4.2s ease-in-out .9s infinite' },
  { left: '6%',  top: '42%', size: 12, color: '#8FD4F5', anim: 'byteTwinkle 3.6s ease-in-out 1.4s infinite' },
  { left: '4%',  top: '74%', size: 15, color: '#FFF3D8', anim: 'byteFloatStar 6s ease-in-out .8s infinite' },
  { left: '90%', top: '62%', size: 11, color: '#FFF3D8', anim: 'byteTwinkle 2.9s ease-in-out .5s infinite' },
  { left: '16%', top: '88%', size: 12, color: '#8FD4F5', anim: 'byteTwinkle 3.7s ease-in-out 1.2s infinite' },
  { left: '62%', top: '90%', size: 10, color: '#FFF3D8', anim: 'byteTwinkle 3.2s ease-in-out .2s infinite' },
]

const STAR_PATH = 'M12 2L14.35 8.76L21.51 8.91L15.8 13.24L17.88 20.09L12 16L6.12 20.09L8.2 13.24L2.49 8.91L9.65 8.76Z'
</script>

<template>
  <section id="home" style="scroll-margin-top:84px; position:relative; overflow:hidden; padding:64px 20px 72px; border-bottom:2.5px solid var(--line-ink); background:var(--dusk-gradient);">

    <!-- scrim -->
    <div aria-hidden="true" style="position:absolute; inset:0; pointer-events:none; z-index:0; background:linear-gradient(100deg, rgba(26,13,36,.62) 0%, rgba(26,13,36,.36) 40%, rgba(26,13,36,0) 66%);"></div>

    <!-- stars -->
    <div aria-hidden="true" style="position:absolute; inset:0; pointer-events:none; z-index:0;">
      <span
        v-for="(s, i) in STARS"
        :key="i"
        data-loop
        :style="`position:absolute; left:${s.left}; top:${s.top}; width:${s.size}px; height:${s.size}px; color:${s.color}; opacity:.8; animation:${s.anim};`"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" style="width:100%;height:100%">
          <path :d="STAR_PATH" />
        </svg>
      </span>
    </div>

    <div style="position:relative; z-index:1; max-width:1120px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:44px; align-items:center;">

      <!-- intro -->
      <div>
        <!-- badge -->
        <div style="display:inline-flex; align-items:center; gap:8px; font-family:var(--font-mono); font-weight:700; font-size:12px; letter-spacing:.02em; padding:7px 14px; border:2.5px solid var(--line-ink); border-radius:999px; background:var(--byte-blue); color:#06283A; box-shadow:2.5px 2.5px 0 var(--line-ink);">
          <svg viewBox="0 0 24 24" fill="currentColor" style="width:14px;height:14px"><path d="M11 21h-1l1-7H6.6c-.9 0-.5-.78-.48-.82C7.55 10.6 9.35 7.5 12 3h1l-1 7h4.5c.42 0 .64.2.42.66C13.9 14.8 11 21 11 21Z"/></svg>
          night owl · wolfdog · swe
        </div>

        <!-- avatar + h1 -->
        <div style="display:flex; align-items:center; gap:18px; margin:20px 0 4px;">
          <span style="width:74px; height:74px; flex:none; border-radius:50%; overflow:hidden; border:3px solid #211309; box-shadow:3px 3px 0 var(--line-ink); background:#FFF8EE;">
            <img :src="'https://cdn.bytewoof.dog/gallery/byte-bust.webp'" alt="Byte, a brown wolfdog with glasses, a blue heart-tag collar and green eyes" style="width:100%; height:100%; object-fit:cover; display:block;">
          </span>
          <h1 style="font-family:var(--font-display); font-weight:800; font-size:clamp(40px,8vw,64px); line-height:.98; letter-spacing:-.03em; color:#FFF8EE; margin:0; text-shadow:0 2px 14px rgba(40,18,42,.35);">hi, i'm byte.</h1>
        </div>

        <p style="font-size:clamp(16px,2.4vw,19px); line-height:1.6; color:rgba(247,236,219,.96); max-width:46ch; margin:14px 0 0; text-shadow:0 1px 10px rgba(30,14,40,.45);">i build things and stay up too late. wolfdog, software engineer, shy at first but i warm up fast. feel free to message me or leave a signature in the guestbook :3</p>

        <!-- night-owl clock pill -->
        <div style="display:inline-flex; align-items:center; gap:10px; margin:22px 0 0; padding:9px 15px; border:2.5px solid var(--line-ink); border-radius:999px; background:var(--surface-card); box-shadow:2.5px 2.5px 0 var(--line-ink);">
          <!-- asleep -->
          <template v-if="mood === 'asleep'">
            <span style="display:inline-flex; color:var(--blue-500);">
              <svg viewBox="0 0 24 24" fill="currentColor" style="width:17px;height:17px"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
            </span>
            <span style="font-family:var(--font-body); font-weight:800; font-size:14px; color:var(--text-strong);">asleep · sleeping in</span>
          </template>
          <!-- awake -->
          <template v-else-if="mood === 'day'">
            <span style="display:inline-flex; color:var(--bark-600);">
              <svg viewBox="0 0 24 24" fill="currentColor" style="width:17px;height:17px"><ellipse cx="6" cy="9.3" rx="2.05" ry="2.7"/><ellipse cx="11" cy="6.6" rx="2.15" ry="2.85"/><ellipse cx="16.4" cy="7.6" rx="2.05" ry="2.7"/><ellipse cx="19.2" cy="12.2" rx="1.75" ry="2.25"/><path d="M12 12.2c3.1 0 5.6 2.2 5.6 4.9 0 2.1-1.75 3.3-3.8 3.3-1.05 0-1.35-.42-1.8-.42s-.75.42-1.8.42c-2.05 0-3.8-1.2-3.8-3.3 0-2.7 2.5-4.9 5.6-4.9Z"/></svg>
            </span>
            <span style="font-family:var(--font-body); font-weight:800; font-size:14px; color:var(--text-strong);">awake · up and about</span>
          </template>
          <!-- wired -->
          <template v-else>
            <span style="display:inline-flex; color:var(--byte-blue);">
              <svg viewBox="0 0 24 24" fill="currentColor" style="width:17px;height:17px"><path d="M11 21h-1l1-7H6.6c-.9 0-.5-.78-.48-.82C7.55 10.6 9.35 7.5 12 3h1l-1 7h4.5c.42 0 .64.2.42.66C13.9 14.8 11 21 11 21Z"/></svg>
            </span>
            <span style="font-family:var(--font-body); font-weight:800; font-size:14px; color:var(--text-strong);">wired · zoomies hours</span>
          </template>
          <span style="width:2px; height:16px; background:var(--line-hairline);"></span>
          <span style="font-family:var(--font-mono); font-size:12px; color:var(--text-muted);">{{ clockLabel }}</span>
        </div>

        <!-- CTAs -->
        <div style="display:flex; flex-wrap:wrap; gap:12px; margin:24px 0 0;">
          <a href="#links" class="byte-btn byte-btn--primary byte-btn--lg">
            <svg viewBox="0 0 24 24" fill="currentColor" style="width:18px;height:18px"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z"/></svg>
            say hi
          </a>
          <a href="#work" class="byte-btn byte-btn--secondary byte-btn--lg">see my work »</a>
        </div>
      </div>

      <!-- BOOP GADGET -->
      <div style="display:flex; justify-content:center;">
        <div style="width:100%; max-width:380px; border:3px solid var(--line-ink); border-radius:28px; background:var(--surface-card); box-shadow:6px 6px 0 var(--line-ink); padding:22px 22px 26px; text-align:center;">

          <!-- mascot -->
          <div style="position:relative; display:flex; justify-content:center; margin:2px 0 6px;">
            <div :data-mood="isBooped ? 'booped' : mood" style="position:relative;">
              <!-- wired star -->
              <span v-if="mood === 'wired'" data-loop style="position:absolute; top:-6px; right:-2px; color:var(--byte-blue); animation:byteFloatStar 3s ease-in-out infinite;">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width:18px;height:18px"><path :d="STAR_PATH"/></svg>
              </span>
              <!-- asleep zzz -->
              <template v-if="mood === 'asleep'">
                <span data-loop style="position:absolute; top:-14px; right:-8px; font-family:var(--font-display); font-weight:800; font-size:18px; color:var(--blue-500); animation:byteZzz 2.6s ease-in-out infinite;">z</span>
                <span data-loop style="position:absolute; top:-6px; right:-18px; font-family:var(--font-display); font-weight:800; font-size:14px; color:var(--blue-400); animation:byteZzz 2.6s ease-in-out .8s infinite;">z</span>
              </template>
              <!-- floating hearts on boop -->
              <span
                v-for="h in hearts"
                :key="h.id"
                aria-hidden="true"
                :style="`position:absolute; left:${h.left}%; top:${h.top}%; width:${h.size}px; height:${h.size}px; color:var(--byte-blush); --hr:${h.rot}deg; pointer-events:none; z-index:7; animation:byteHeartSlow 3s ease-out forwards;`"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" style="width:100%;height:100%">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z"/>
                </svg>
              </span>
              <button
                type="button"
                @click="handleBoop"
                aria-label="boop byte on the nose"
                style="all:unset; cursor:pointer; display:block; position:relative; border-radius:50%;"
              >
                <span style="display:block; width:clamp(160px,46vw,210px); height:clamp(160px,46vw,210px); border-radius:50%; overflow:hidden; border:3px solid #211309; box-shadow:5px 5px 0 var(--line-ink); background:#FFFFFF;">
                  <span data-byte-face data-loop :key="boopAnimKey" style="position:relative; display:block; width:108%; height:108%; margin:-4%;">
                    <img :src="'https://cdn.bytewoof.dog/gallery/byte-icon.webp'" alt="Byte the wolfdog — boop his nose" style="width:100%; height:100%; object-fit:cover; object-position:center 32%; display:block;">
                  </span>
                </span>
              </button>
            </div>
          </div>

          <!-- reaction / hint -->
          <div v-if="reaction" style="display:inline-block; margin:2px 0 10px; padding:5px 13px; border:2.5px solid var(--line-ink); border-radius:999px; background:var(--byte-blush); color:#5A1F30; font-family:var(--font-display); font-weight:800; font-size:14px; box-shadow:2px 2px 0 var(--line-ink);">{{ reaction }}</div>
          <div v-else style="margin:6px 0 12px; font-family:var(--font-mono); font-size:12px; color:var(--text-muted);">↑ boop my nose</div>

          <!-- odometer -->
          <div style="font-family:var(--font-mono); font-weight:700; font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--text-muted);">global boops</div>
          <div style="display:flex; align-items:center; justify-content:center; gap:1px; margin:6px 0 2px; padding:8px 6px; border:2.5px solid var(--line-ink); border-radius:14px; background:var(--surface-sunken); box-shadow:inset 0 2px 6px rgba(39,25,18,.18);">
            <template v-for="(t, i) in odo" :key="i">
              <!-- separator comma -->
              <span v-if="t.sep" style="font-family:var(--font-display); font-weight:800; font-size:clamp(30px,7vw,46px); line-height:1; color:var(--text-faint); width:.28em; text-align:center;">,</span>
              <!-- rolling digit strip -->
              <span
                v-else
                style="display:inline-block; width:.64em; height:1em; overflow:hidden; vertical-align:top; font-family:var(--font-display); font-weight:800; font-size:clamp(30px,7vw,46px); line-height:1; color:var(--text-strong);"
              >
                <span data-loop :style="`display:flex; flex-direction:column; transition:transform .55s var(--ease-spring); transform:${t.transform};`">
                  <span v-for="n in 10" :key="n" style="height:1em; line-height:1; text-align:center;">{{ n - 1 }}</span>
                </span>
              </span>
            </template>
          </div>
          <div style="font-family:var(--font-mono); font-size:12px; color:var(--text-muted); margin-top:8px;">≈ <span style="color:var(--text-link); font-weight:700;">{{ bLabel }}</span> of boops</div>
        </div>
      </div>
    </div>
  </section>
</template>
