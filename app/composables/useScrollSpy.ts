export function useScrollSpy(ids: string[]) {
  const active = ref(ids[0])

  onMounted(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && ids.includes(e.target.id)) active.value = e.target.id
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  })

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 64
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }

  return { active, scrollTo }
}
