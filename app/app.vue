<script setup lang="ts">
const { theme, init: initTheme } = useTheme()
const { motionOn, init: initMotion } = useMotion()
const { scrollTo } = useScrollSpy(['home', 'about', 'work', 'gallery', 'cons', 'links', 'terminal'])

onMounted(() => {
  initTheme()
  initMotion()
})

useHead({
  title: 'byte - wolfdog swe',
  link: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  meta: [
    { name: 'description', content: 'byte · night-owl wolfdog software engineer · portfolio' },
    { property: 'og:title', content: 'byte — wolfdog swe' },
    { property: 'og:description', content: 'i build things and stay up too late. wolfdog, software engineer, shy at first but i warm up fast.' },
  ],
})
</script>

<template>
  <div
    :data-byte-theme="theme"
    :data-byte-motion="motionOn ? 'on' : 'off'"
    style="position:relative; min-height:100vh; width:100%; overflow-x:hidden; background:var(--surface-page); color:var(--text-body); font-family:var(--font-body); transition: background .35s var(--ease-out), color .35s var(--ease-out);"
  >
    <SiteNav @navigate="scrollTo" />
    <main>
      <SiteHero @navigate="scrollTo" />
      <SiteAbout />
      <SiteWork />
      <SiteGallery />
      <SiteCons />
      <SiteLinks />
      <SiteTerminal />
    </main>
    <SiteFooter />
    <PawTrail />
  </div>
</template>
