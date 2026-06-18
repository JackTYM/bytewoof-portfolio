<script setup lang="ts">
import { GALLERY, type GalleryItem } from '~/content/site'

const openSlug = ref<string | null>(null)
const likes = ref<Record<string, number>>(
  Object.fromEntries(GALLERY.map(g => [g.slug, g.seedLikes]))
)
const likedSlugs = ref<Set<string>>(new Set())

// NSFW gate
const nsfwUnlocked = ref(false)
const showAgeGate = ref(false)
const birthYearInput = ref('')
const ageError = ref('')

const visibleGallery = computed<GalleryItem[]>(() =>
  nsfwUnlocked.value ? GALLERY : GALLERY.filter(g => !g.nsfw)
)

const openItem = computed<GalleryItem | null>(() =>
  openSlug.value ? (GALLERY.find(g => g.slug === openSlug.value) ?? null) : null
)

function open(slug: string) { openSlug.value = slug }
function close() { openSlug.value = null }

function toggleNsfw() {
  if (nsfwUnlocked.value) {
    nsfwUnlocked.value = false
    try { localStorage.removeItem('byte.nsfw') } catch {}
  } else {
    birthYearInput.value = ''
    ageError.value = ''
    showAgeGate.value = true
  }
}

function verifyAge() {
  const year = parseInt(birthYearInput.value, 10)
  const current = new Date().getFullYear()
  if (isNaN(year) || year < 1900 || year > current) {
    ageError.value = 'please enter a valid birth year'
    return
  }
  if (current - year < 18) {
    ageError.value = 'you need to be 18 or older to view this content'
    return
  }
  nsfwUnlocked.value = true
  try { localStorage.setItem('byte.nsfw', 'verified') } catch {}
  showAgeGate.value = false
}

function toggleLike(slug: string, e: Event) {
  e.stopPropagation()
  if (likedSlugs.value.has(slug)) {
    likedSlugs.value.delete(slug)
    likes.value[slug] = (likes.value[slug] ?? 0) - 1
  } else {
    likedSlugs.value.add(slug)
    likes.value[slug] = (likes.value[slug] ?? 0) + 1
    $fetch('/api/gallery/likes', { method: 'POST', body: { slug, delta: 1 } }).catch(() => {})
  }
}

async function loadLikes() {
  try {
    const data = await $fetch<Record<string, number>>('/api/gallery/likes')
    Object.assign(likes.value, data)
  } catch {}
}

function hover(el: EventTarget | null, on: boolean) {
  if (!el) return
  const e = el as HTMLElement
  e.style.transform = on ? 'translate(-2px,-2px)' : ''
  e.style.boxShadow = on ? '7px 7px 0 var(--line-ink)' : '5px 5px 0 var(--line-ink)'
}

onMounted(() => {
  loadLikes()
  try {
    if (localStorage.getItem('byte.nsfw') === 'verified') nsfwUnlocked.value = true
  } catch {}
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { close(); showAgeGate.value = false }
  })
})
</script>

<template>
  <section id="gallery" style="scroll-margin-top:84px; padding:78px 20px; border-bottom:2.5px solid var(--line-ink);">
    <div style="max-width:1120px; margin:0 auto;">
      <!-- header row -->
      <div style="display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:14px;">
        <div>
          <div style="display:inline-flex; align-items:center; gap:8px; font-family:var(--font-mono); font-weight:700; font-size:12px; padding:6px 13px; border:2.5px solid var(--line-ink); border-radius:999px; background:var(--ink-950); color:var(--blue-300); box-shadow:2.5px 2.5px 0 var(--line-ink);">
            <svg viewBox="0 0 24 24" fill="currentColor" style="width:14px;height:14px"><path d="M12 2L14.35 8.76L21.51 8.91L15.8 13.24L17.88 20.09L12 16L6.12 20.09L8.2 13.24L2.49 8.91L9.65 8.76Z"/></svg>
            art of me
          </div>
          <h2 style="font-family:var(--font-display); font-weight:800; font-size:clamp(30px,5vw,46px); line-height:1.04; letter-spacing:-.02em; color:var(--text-strong); margin:14px 0 0;">gallery</h2>
        </div>

        <!-- NSFW toggle -->
        <button
          type="button"
          @click="toggleNsfw"
          :aria-pressed="nsfwUnlocked"
          :aria-label="nsfwUnlocked ? 'hide 18+ art' : 'show 18+ art'"
          :style="`display:inline-flex; align-items:center; gap:8px; padding:8px 15px; cursor:pointer; font-family:var(--font-mono); font-weight:700; font-size:12px; border:2.5px solid var(--line-ink); border-radius:999px; box-shadow:2.5px 2.5px 0 var(--line-ink); transition:background .18s,color .18s; ${nsfwUnlocked ? 'background:var(--blush-500);color:#5A1F30;' : 'background:var(--surface-card);color:var(--text-muted);'}`"
        >
          <!-- toggle track -->
          <span :style="`display:inline-flex; width:30px; height:16px; border-radius:999px; border:2px solid currentColor; align-items:center; padding:2px; transition:background .18s; background:${nsfwUnlocked ? 'var(--blush-600)' : 'transparent'};`">
            <span :style="`display:block; width:10px; height:10px; border-radius:50%; background:currentColor; transition:transform .18s; transform:${nsfwUnlocked ? 'translateX(14px)' : 'translateX(0)'};`"></span>
          </span>
          18+ art
        </button>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:20px; margin-top:26px;">
        <button
          v-for="item in visibleGallery"
          :key="item.slug"
          type="button"
          @click="open(item.slug)"
          @mouseover="hover($event.currentTarget, true)"
          @mouseout="hover($event.currentTarget, false)"
          :aria-label="`open ${item.title}`"
          style="all:unset; cursor:pointer; display:flex; flex-direction:column; border:3px solid #211309; border-radius:20px; background:#FFF8EE; box-shadow:5px 5px 0 var(--line-ink); overflow:hidden; transition:transform .14s var(--ease-spring), box-shadow .14s var(--ease-out);"
        >
          <span style="position:relative; display:block; aspect-ratio:1/1; background:#F3E6D2; overflow:hidden; border-bottom:3px solid #211309;">
            <img :src="item.src" :alt="item.title" loading="lazy" style="width:100%; height:100%; object-fit:cover; display:block;">
            <!-- 18+ badge on NSFW items -->
            <span
              v-if="item.nsfw"
              style="position:absolute; top:8px; left:8px; font-family:var(--font-mono); font-weight:700; font-size:10px; padding:3px 7px; border:2px solid #5A1F30; border-radius:999px; background:var(--blush-500); color:#5A1F30;"
            >18+</span>
          </span>
          <span style="display:flex; align-items:center; justify-content:space-between; gap:8px; padding:11px 13px; background:#FFF8EE;">
            <span style="display:flex; flex-direction:column; gap:1px; min-width:0;">
              <span style="font-family:var(--font-display); font-weight:800; font-size:15px; color:#271912; text-align:left;">{{ item.title }}</span>
              <span style="font-family:var(--font-mono); font-size:11px; color:#8A7461; text-align:left; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{{ item.credit }}</span>
            </span>
            <span
              role="button"
              tabindex="0"
              @click="toggleLike(item.slug, $event)"
              @keydown.enter.space.prevent="toggleLike(item.slug, $event)"
              :aria-label="`like ${item.title}`"
              style="cursor:pointer; flex:none; display:inline-flex; align-items:center; gap:4px; font-family:var(--font-mono); font-size:11px; color:#D87A95;"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" style="width:13px;height:13px">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z"/>
              </svg>
              {{ likes[item.slug] ?? 0 }}
            </span>
          </span>
        </button>
      </div>
    </div>

    <!-- Age gate modal -->
    <Teleport to="body">
      <div
        v-if="showAgeGate"
        role="dialog"
        aria-modal="true"
        aria-label="age verification"
        @click.self="showAgeGate = false"
        style="position:fixed; inset:0; z-index:130; display:flex; align-items:center; justify-content:center; padding:24px; background:color-mix(in srgb, var(--ink-950) 80%, transparent); backdrop-filter:blur(6px);"
      >
        <div style="width:100%; max-width:380px; border:3px solid var(--line-ink); border-radius:24px; background:var(--surface-card); box-shadow:7px 7px 0 var(--line-ink); padding:30px 28px;">
          <div style="font-family:var(--font-display); font-weight:800; font-size:22px; color:var(--text-strong); margin:0 0 4px;">hold on ✋</div>
          <p style="font-size:14px; color:var(--text-body); line-height:1.6; margin:0 0 22px;">some of this art is 18+. enter your birth year to verify your age.</p>

          <label style="display:block; font-family:var(--font-mono); font-weight:700; font-size:12px; color:var(--text-muted); margin-bottom:7px;">birth year</label>
          <input
            v-model="birthYearInput"
            type="number"
            placeholder="e.g. 1998"
            min="1900"
            :max="new Date().getFullYear()"
            @keydown.enter="verifyAge"
            style="width:100%; box-sizing:border-box; padding:10px 14px; font-family:var(--font-mono); font-size:15px; font-weight:700; border:2.5px solid var(--line-ink); border-radius:12px; background:var(--surface-sunken); color:var(--text-strong); outline:none;"
          >

          <div v-if="ageError" style="margin-top:9px; font-family:var(--font-mono); font-size:12px; color:#B91C1C;">{{ ageError }}</div>

          <div style="display:flex; gap:10px; margin-top:18px;">
            <button
              type="button"
              @click="showAgeGate = false"
              style="flex:1; padding:10px; cursor:pointer; font-family:var(--font-body); font-weight:700; font-size:14px; border:2.5px solid var(--line-ink); border-radius:12px; background:var(--surface-card); color:var(--text-muted); box-shadow:2px 2px 0 var(--line-ink);"
            >cancel</button>
            <button
              type="button"
              @click="verifyAge"
              style="flex:2; padding:10px; cursor:pointer; font-family:var(--font-body); font-weight:800; font-size:14px; border:2.5px solid var(--line-ink); border-radius:12px; background:var(--byte-blue); color:#06283A; box-shadow:2px 2px 0 var(--line-ink);"
            >verify age →</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="openItem"
        role="dialog"
        aria-modal="true"
        aria-label="artwork viewer"
        @click="close"
        style="position:fixed; inset:0; z-index:120; display:flex; align-items:center; justify-content:center; padding:24px; background:color-mix(in srgb, var(--ink-950) 80%, transparent); backdrop-filter:blur(6px);"
      >
        <div
          @click.stop
          style="position:relative; max-width:560px; width:100%; border:3px solid #211309; border-radius:24px; background:#FFF8EE; box-shadow:7px 7px 0 var(--line-ink); overflow:hidden;"
        >
          <button
            type="button"
            @click="close"
            aria-label="close"
            style="position:absolute; top:12px; right:12px; z-index:2; width:38px; height:38px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; border:2.5px solid #211309; border-radius:50%; background:#FFF8EE; color:#271912; box-shadow:2px 2px 0 #211309;"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" style="width:18px;height:18px">
              <path d="M6 6l12 12M18 6L6 18"/>
            </svg>
          </button>
          <div style="background:#F3E6D2;">
            <img :src="openItem.src" :alt="openItem.title" style="width:100%; max-height:64vh; object-fit:contain; display:block;">
          </div>
          <div style="padding:18px 20px; border-top:3px solid #211309;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-family:var(--font-display); font-weight:800; font-size:22px; color:#271912;">{{ openItem.title }}</span>
              <span v-if="openItem.nsfw" style="font-family:var(--font-mono); font-weight:700; font-size:10px; padding:3px 7px; border:2px solid #5A1F30; border-radius:999px; background:var(--blush-500); color:#5A1F30;">18+</span>
            </div>
            <div style="font-size:14px; color:#4A3526; margin:4px 0 0;">{{ openItem.desc }}</div>
            <div style="font-family:var(--font-mono); font-size:12px; color:#8A7461; margin-top:8px;">
              art by
              <a
                v-if="openItem.creditUrl !== '#'"
                :href="openItem.creditUrl"
                target="_blank"
                rel="noopener"
                style="color:#8A7461; font-weight:700;"
              >{{ openItem.credit }}</a>
              <span v-else style="font-weight:700;">{{ openItem.credit }}</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
