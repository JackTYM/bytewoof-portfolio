<script setup lang="ts">
const { motionOn, toggle: toggleMotion } = useMotion()
const { toggle: toggleTheme, theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')
</script>

<template>
  <nav style="position:sticky; top:0; z-index:50; backdrop-filter:saturate(1.2) blur(10px); background:color-mix(in srgb, var(--surface-page) 82%, transparent); border-bottom:2.5px solid var(--line-ink);">
    <div style="max-width:1120px; margin:0 auto; padding:11px 20px; display:flex; align-items:center; gap:16px;">
      <!-- logo -->
      <a href="#home" aria-label="byte — home" style="display:inline-flex; align-items:center; gap:9px; text-decoration:none; color:var(--text-strong); flex:none;">
        <span style="width:38px; height:38px; flex:none; border-radius:50%; overflow:hidden; border:2.5px solid var(--line-ink); background:#FFF8EE; box-shadow:2.5px 2.5px 0 var(--line-ink);">
          <img :src="'https://cdn.bytewoof.dog/gallery/byte-icon.webp'" alt="" style="width:100%; height:100%; object-fit:cover; object-position:center 30%; display:block;">
        </span>
        <span style="font-family:var(--font-display); font-weight:800; font-size:24px; letter-spacing:-.03em;">byte</span>
      </a>

      <!-- nav links -->
      <div style="flex:1; display:flex; align-items:center; gap:4px; justify-content:center; flex-wrap:wrap;">
        <a href="#about"   style="font-family:var(--font-body); font-weight:800; font-size:14.5px; color:var(--text-body); text-decoration:none; padding:8px 12px; border-radius:999px;">about</a>
        <a href="#work"    style="font-family:var(--font-body); font-weight:800; font-size:14.5px; color:var(--text-body); text-decoration:none; padding:8px 12px; border-radius:999px;">work</a>
        <a href="#gallery" style="font-family:var(--font-body); font-weight:800; font-size:14.5px; color:var(--text-body); text-decoration:none; padding:8px 12px; border-radius:999px;">art</a>
        <a href="#cons"     style="font-family:var(--font-body); font-weight:800; font-size:14.5px; color:var(--text-body); text-decoration:none; padding:8px 12px; border-radius:999px;">cons</a>
        <a href="#terminal" style="font-family:var(--font-body); font-weight:800; font-size:14.5px; color:var(--text-body); text-decoration:none; padding:8px 12px; border-radius:999px;">nerdy</a>
        <a href="#links"    style="font-family:var(--font-body); font-weight:800; font-size:14.5px; color:var(--text-body); text-decoration:none; padding:8px 12px; border-radius:999px;">links</a>
      </div>

      <!-- controls -->
      <div style="display:flex; align-items:center; gap:9px; flex:none;">
        <!-- motion toggle -->
        <button
          type="button"
          @click="toggleMotion"
          aria-label="toggle animations"
          title="pause / play motion"
          style="width:40px; height:40px; flex:none; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; border:2.5px solid var(--line-ink); border-radius:50%; background:var(--surface-card); color:var(--text-strong); box-shadow:2.5px 2.5px 0 var(--line-ink);"
        >
          <svg v-if="motionOn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" style="width:18px;height:18px">
            <rect x="6" y="5" width="4" height="14" rx="1.3"/>
            <rect x="14" y="5" width="4" height="14" rx="1.3"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor" style="width:18px;height:18px">
            <path d="M7 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 7 5.5Z"/>
          </svg>
        </button>

        <!-- theme toggle -->
        <button
          type="button"
          @click="toggleTheme"
          aria-label="toggle light and dark mode"
          title="light / dark"
          style="width:40px; height:40px; flex:none; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; border:2.5px solid var(--line-ink); border-radius:50%; box-shadow:2.5px 2.5px 0 var(--line-ink); background:var(--surface-card); color:var(--text-strong);"
        >
          <svg v-if="isDark" viewBox="0 0 24 24" fill="currentColor" style="width:19px;height:19px">
            <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" style="width:19px;height:19px">
            <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none"/>
            <path d="M12 2.2v2.4M12 19.4v2.4M4.2 12H1.8M22.2 12h-2.4M5.6 5.6 7.3 7.3M16.7 16.7l1.7 1.7M18.4 5.6 16.7 7.3M7.3 16.7 5.6 18.4"/>
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>
