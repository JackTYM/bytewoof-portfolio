<script setup lang="ts">
import { CONS } from '~/content/site'

function hover(el: EventTarget | null, on: boolean) {
  if (!el) return
  const e = el as HTMLElement
  e.style.transform = on ? 'translate(-2px,-2px)' : ''
  e.style.boxShadow = on ? '7px 7px 0 var(--line-ink)' : '5px 5px 0 var(--line-ink)'
}
</script>

<template>
  <section id="cons" style="scroll-margin-top:84px; padding:78px 20px; border-bottom:2.5px solid var(--line-ink);">
    <div style="max-width:1120px; margin:0 auto;">
      <!-- badge -->
      <div style="display:inline-flex; align-items:center; gap:8px; font-family:var(--font-mono); font-weight:700; font-size:12px; padding:6px 13px; border:2.5px solid var(--line-ink); border-radius:999px; background:var(--byte-blue); color:#06283A; box-shadow:2.5px 2.5px 0 var(--line-ink);">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width:14px;height:14px">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        out &amp; about
      </div>
      <h2 style="font-family:var(--font-display); font-weight:800; font-size:clamp(30px,5vw,46px); line-height:1.04; letter-spacing:-.02em; color:var(--text-strong); margin:14px 0 0;">cons i'm attending</h2>
      <p style="font-size:15px; font-weight:600; color:var(--text-body); margin:10px 0 0; max-width:48ch;">come say hi in person - here's where i'll be.</p>

      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:22px; margin-top:30px;">
        <a
          v-for="c in CONS"
          :key="c.slug"
          :href="c.href"
          target="_blank"
          rel="noopener"
          style="text-decoration:none; display:flex; flex-direction:column; border:3px solid var(--line-ink); border-radius:24px; background:var(--surface-card); box-shadow:5px 5px 0 var(--line-ink); padding:24px; transition:transform .14s var(--ease-spring), box-shadow .14s var(--ease-out);"
          @mouseover="hover($event.currentTarget, true)"
          @mouseout="hover($event.currentTarget, false)"
        >
          <!-- top row: calendar chip + upcoming pill -->
          <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
            <!-- calendar chip -->
            <span
              :style="`width:52px; height:52px; flex:none; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0; border:2.5px solid var(--line-ink); border-radius:13px; box-shadow:2.5px 2.5px 0 var(--line-ink); background:${c.accent}; color:${c.accentFg};`"
            >
              <span style="font-family:var(--font-mono); font-weight:700; font-size:9px; line-height:1; letter-spacing:.06em;">{{ c.month }}</span>
              <span style="font-family:var(--font-display); font-weight:800; font-size:16px; line-height:1.1;">{{ c.day }}</span>
              <span style="font-family:var(--font-mono); font-weight:700; font-size:9px; line-height:1; opacity:.7;">{{ c.year }}</span>
            </span>
            <!-- upcoming pill -->
            <span style="display:inline-flex; align-items:center; gap:6px; font-family:var(--font-body); font-weight:800; font-size:12px; padding:4px 11px; border:2px solid var(--green-600); border-radius:999px; background:#d4edda; color:#0a5c2d;">
              <span style="width:7px; height:7px; border-radius:50%; background:var(--green-600);"></span>
              upcoming
            </span>
          </div>

          <!-- name + meta -->
          <h3 style="font-family:var(--font-display); font-weight:800; font-size:22px; color:var(--text-strong); margin:16px 0 4px; line-height:1.1;">{{ c.name }}</h3>
          <div style="font-family:var(--font-mono); font-size:12px; color:var(--text-muted); margin-bottom:2px;">{{ c.kind }} · {{ c.city }}</div>
          <div style="font-family:var(--font-mono); font-size:12px; color:var(--text-muted); margin-bottom:12px;">{{ c.venue }} · {{ c.dates }}</div>

          <!-- blurb -->
          <p style="font-size:14.5px; color:var(--text-body); line-height:1.55; margin:0; flex:1;">{{ c.blurb }}</p>

          <div style="margin-top:16px; font-family:var(--font-mono); font-weight:700; font-size:13px; color:var(--text-link);">more info »</div>
        </a>
      </div>
    </div>
  </section>
</template>
