<script setup lang="ts">
const { theme, init: initTheme } = useTheme()
const { motionOn, init: initMotion } = useMotion()
const { scrollTo } = useScrollSpy(['home', 'about', 'work', 'gallery', 'cons', 'terminal', 'links'])

onMounted(() => {
  initTheme()
  initMotion()
})

useHead({
  title: 'byte - wolfdog software engineer & night-owl developer',
  link: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  meta: [
    { name: 'description', content: 'byte is a wolfdog software engineer who builds things and stays up too late. portfolio, gallery, guestbook, and more - come say hi.' },
    { property: 'og:url', content: 'https://bytewoof.dog' },
    { property: 'og:site_name', content: 'byte' },
    { property: 'og:title', content: 'byte - wolfdog swe' },
    { property: 'og:description', content: 'i build things and stay up too late. wolfdog, software engineer, shy at first but i warm up fast.' },
    { property: 'og:image', content: 'https://cdn.bytewoof.dog/gallery/og.webp' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'byte - wolfdog swe' },
    { name: 'twitter:description', content: 'i build things and stay up too late. wolfdog, software engineer, shy at first but i warm up fast.' },
    { name: 'twitter:image', content: 'https://cdn.bytewoof.dog/gallery/og.webp' },
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
      <SiteTerminal />
      <SiteLinks />
    </main>
    <SiteFooter />
    <PawTrail />
  </div>
</template>
