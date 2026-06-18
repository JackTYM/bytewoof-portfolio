<script setup lang="ts">
import { LINKS } from '~/content/site'

// Link row tone → visual theming
const TONE_THEME: Record<string, { bg: string; text: string; cell: string }> = {
  '#3B6CB7': { bg: '#EAF1FB',           text: '#1B3A6B',           cell: '#C3D8F5' },
  '#271912': { bg: 'var(--ink-950)',    text: 'var(--cream-100)', cell: 'rgba(240,220,196,.16)' },
  '#0F0F0F': { bg: 'var(--ink-950)',    text: 'var(--cream-100)', cell: 'rgba(240,220,196,.10)' },
  '#E1306C': { bg: '#FDE8F0',           text: '#7C1535',           cell: '#F9BDD6' },
  '#2AABEE': { bg: '#E8F7FF',           text: '#074e7b',           cell: '#BDE8FF' },
}
</script>

<template>
  <section id="links" class="byte-texture-paws" style="scroll-margin-top:84px; padding:78px 20px; border-bottom:2.5px solid var(--line-ink);">
    <div style="max-width:1120px; margin:0 auto;">
      <!-- badge -->
      <div style="display:inline-flex; align-items:center; gap:8px; font-family:var(--font-mono); font-weight:700; font-size:12px; padding:6px 13px; border:2.5px solid var(--line-ink); border-radius:999px; background:var(--byte-blue); color:#06283A; box-shadow:2.5px 2.5px 0 var(--line-ink);">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width:14px;height:14px"><ellipse cx="6" cy="9.3" rx="2.05" ry="2.7"/><ellipse cx="11" cy="6.6" rx="2.15" ry="2.85"/><ellipse cx="16.4" cy="7.6" rx="2.05" ry="2.7"/><ellipse cx="19.2" cy="12.2" rx="1.75" ry="2.25"/><path d="M12 12.2c3.1 0 5.6 2.2 5.6 4.9 0 2.1-1.75 3.3-3.8 3.3-1.05 0-1.35-.42-1.8-.42s-.75.42-1.8.42c-2.05 0-3.8-1.2-3.8-3.3 0-2.7 2.5-4.9 5.6-4.9Z"/></svg>
        find me
      </div>
      <h2 style="font-family:var(--font-display); font-weight:800; font-size:clamp(30px,5vw,46px); line-height:1.04; letter-spacing:-.02em; color:var(--text-strong); margin:14px 0 6px;">say hi</h2>
      <p style="font-size:15px; font-weight:600; color:var(--text-body); margin:0 0 26px; max-width:48ch;">tap a row to find me — dm's open on telegram or x.</p>

      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:28px; align-items:start;">
        <!-- link rows -->
        <div style="display:flex; flex-direction:column; gap:13px;">
          <a
            v-for="l in LINKS"
            :key="l.title"
            :href="l.href"
            target="_blank"
            rel="noopener"
            class="byte-linkrow"
            :style="`background:${TONE_THEME[l.tone]?.bg ?? 'var(--surface-card)'}; color:${TONE_THEME[l.tone]?.text ?? 'var(--text-body)'};`"
          >
            <span
              class="byte-linkrow__stamp"
              :style="`background:${TONE_THEME[l.tone]?.cell ?? 'var(--surface-sunken)'};`"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" style="width:22px;height:22px">
                <path :d="l.icon" />
              </svg>
            </span>
            <span class="byte-linkrow__body">
              <span class="byte-linkrow__title">{{ l.title }}</span>
              <span class="byte-linkrow__sub byte-linkrow__sub">{{ l.sub }}</span>
            </span>
            <span
              class="byte-linkrow__go"
              :style="`background:${TONE_THEME[l.tone]?.cell ?? 'var(--surface-sunken)'};`"
            >»</span>
          </a>
        </div>

        <!-- guestbook -->
        <div style="display:flex; flex-direction:column; gap:18px;">
          <SiteGuestbook />
        </div>
      </div>
    </div>
  </section>
</template>
