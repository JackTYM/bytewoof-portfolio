<script setup lang="ts">
import { PROJECTS } from '~/content/site'

const ICON_PATHS: Record<string, string> = {
  bolt:   'M11 21h-1l1-7H6.6c-.9 0-.5-.78-.48-.82C7.55 10.6 9.35 7.5 12 3h1l-1 7h4.5c.42 0 .64.2.42.66C13.9 14.8 11 21 11 21Z',
  star:   'M12 2L14.35 8.76L21.51 8.91L15.8 13.24L17.88 20.09L12 16L6.12 20.09L8.2 13.24L2.49 8.91L9.65 8.76Z',
  chip:   'M9 2h2v3h2V2h2v3h2a2 2 0 0 1 2 2v2h3v2h-3v2h3v2h-3v2a2 2 0 0 1-2 2h-2v3h-2v-3h-2v3H9v-3H7a2 2 0 0 1-2-2v-2H2v-2h3v-2H2V9h3V7a2 2 0 0 1 2-2h2V2zm-2 5v10h10V7H7zm3 3h4v4h-4v-4z',
  gamepad: 'M7 6h10a5 5 0 0 1 5 5v3a3 3 0 0 1-5.4 1.8L15 14H9l-1.6 1.8A3 3 0 0 1 2 14v-3a5 5 0 0 1 5-5zm0 3v1H6v2h1v1h2v-1h1v-2H9V9H7zm8.5 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm2.5 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
}

// Tile theming per project
const TILE_THEME: Record<string, { tileBg: string; tileFg: string; badgeBg: string; badgeFg: string; badgeBd: string }> = {
  sogen:             { tileBg: 'var(--blush-300)',  tileFg: '#6B273C',  badgeBg: '#d4edda', badgeFg: '#0a5c2d', badgeBd: 'var(--green-600)' },
  cemubar:           { tileBg: 'var(--blue-300)',   tileFg: '#0E4763',  badgeBg: '#dbeafe', badgeFg: '#1e40af', badgeBd: 'var(--blue-600)' },
  marketshark:       { tileBg: 'var(--byte-blue)',  tileFg: '#06283A',  badgeBg: '#fdf0dc', badgeFg: '#7a4a0a', badgeBd: 'var(--amber-500)' },
}

function hover(el: EventTarget | null, on: boolean) {
  if (!el) return
  const e = el as HTMLElement
  e.style.transform = on ? 'translate(-2px,-2px)' : ''
  e.style.boxShadow = on ? '7px 7px 0 var(--line-ink)' : '5px 5px 0 var(--line-ink)'
}
</script>

<template>
  <section id="work" style="scroll-margin-top:84px; padding:78px 20px; border-bottom:2.5px solid var(--line-ink);">
    <div style="max-width:1120px; margin:0 auto;">
      <div style="display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:space-between; gap:14px;">
        <div>
          <div style="display:inline-flex; align-items:center; gap:8px; font-family:var(--font-mono); font-weight:700; font-size:12px; padding:6px 13px; border:2.5px solid var(--line-ink); border-radius:999px; background:var(--byte-blue); color:#06283A; box-shadow:2.5px 2.5px 0 var(--line-ink);">
            <svg viewBox="0 0 24 24" fill="currentColor" style="width:14px;height:14px">
              <rect x="6.5" y="10" width="11" height="4" rx="2"/><circle cx="6.6" cy="9.6" r="2.5"/><circle cx="6.6" cy="14.4" r="2.5"/><circle cx="17.4" cy="9.6" r="2.5"/><circle cx="17.4" cy="14.4" r="2.5"/>
            </svg>
            things i've shipped
          </div>
          <h2 style="font-family:var(--font-display); font-weight:800; font-size:clamp(30px,5vw,46px); line-height:1.04; letter-spacing:-.02em; color:var(--text-strong); margin:14px 0 0;">work</h2>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:22px; margin-top:30px;">
        <a
          v-for="p in PROJECTS"
          :key="p.slug"
          :href="p.href || undefined"
          target="_blank"
          rel="noopener"
          style="text-decoration:none; display:flex; flex-direction:column; border:3px solid var(--line-ink); border-radius:24px; background:var(--surface-card); box-shadow:5px 5px 0 var(--line-ink); padding:24px; transition:transform .14s var(--ease-spring), box-shadow .14s var(--ease-out);"
          @mouseover="hover($event.currentTarget, true)"
          @mouseout="hover($event.currentTarget, false)"
        >
          <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
            <!-- icon tile -->
            <span
              :style="`width:46px;height:46px;flex:none;display:flex;align-items:center;justify-content:center;border:2.5px solid var(--line-ink);border-radius:13px;background:${TILE_THEME[p.slug].tileBg};color:${TILE_THEME[p.slug].tileFg};box-shadow:2.5px 2.5px 0 var(--line-ink);`"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" style="width:24px;height:24px;display:block">
                <path :d="ICON_PATHS[p.icon]" />
              </svg>
            </span>
            <!-- status badge -->
            <span
              :style="`display:inline-flex;align-items:center;gap:6px;font-family:var(--font-body);font-weight:800;font-size:12px;padding:4px 11px;border:2px solid ${TILE_THEME[p.slug].badgeBd};border-radius:999px;background:${TILE_THEME[p.slug].badgeBg};color:${TILE_THEME[p.slug].badgeFg};`"
            >
              <span :style="`width:7px;height:7px;border-radius:50%;background:${TILE_THEME[p.slug].badgeBd};`"></span>
              {{ p.status }}
            </span>
          </div>
          <h3 style="font-family:var(--font-display); font-weight:800; font-size:23px; color:var(--text-strong); margin:16px 0 6px;">{{ p.name }}</h3>
          <p style="font-size:14.5px; color:var(--text-body); line-height:1.55; margin:0 0 16px; flex:1;">{{ p.description }}</p>
          <div style="display:flex; flex-wrap:wrap; gap:7px;">
            <span
              v-for="tag in p.tags"
              :key="tag"
              style="display:inline-flex;align-items:center;font-family:var(--font-mono);font-weight:600;font-size:12px;padding:4px 10px;border:2px solid var(--line-ink);border-radius:999px;background:var(--surface-sunken);color:var(--text-strong);"
            >{{ tag }}</span>
          </div>
          <div v-if="p.href" style="margin-top:16px;font-family:var(--font-mono);font-weight:700;font-size:13px;color:var(--text-link);">{{ p.ctaLabel }} »</div>
        </a>
      </div>
    </div>
  </section>
</template>
