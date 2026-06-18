<script setup lang="ts">
const { motionOn, toggle: toggleMotion } = useMotion()
</script>

<template>
  <footer class="byte-texture-paws" style="position:relative; padding:48px 20px; background:var(--surface-card);">
    <div style="max-width:1120px; margin:0 auto; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:18px;">
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="width:42px; height:42px; flex:none; border-radius:50%; overflow:hidden; border:2.5px solid var(--line-ink); background:#FFF8EE; box-shadow:2.5px 2.5px 0 var(--line-ink);">
          <img :src="'https://cdn.bytewoof.dog/gallery/byte-icon.webp'" alt="" style="width:100%; height:100%; object-fit:cover; object-position:center 30%; display:block;">
        </span>
        <div>
          <div style="font-family:var(--font-display); font-weight:800; font-size:18px; color:var(--text-strong); line-height:1;">byte</div>
          <div style="font-family:var(--font-mono); font-size:12px; color:var(--text-muted); margin-top:3px;">made at 2am when i should be asleep</div>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <button
          type="button"
          @click="toggleMotion"
          style="all:unset; cursor:pointer; display:inline-flex; align-items:center; gap:7px; font-family:var(--font-body); font-weight:800; font-size:13px; color:var(--text-body); padding:8px 13px; border:2.5px solid var(--line-ink); border-radius:999px; background:var(--surface-sunken);"
        >{{ motionOn ? 'pause motion' : 'play motion' }}</button>
        <a href="#home" style="text-decoration:none; display:inline-flex; align-items:center; gap:7px; font-family:var(--font-body); font-weight:800; font-size:13px; color:var(--text-body); padding:8px 13px; border:2.5px solid var(--line-ink); border-radius:999px; background:var(--surface-sunken);">back to top ↑</a>
      </div>
    </div>
  </footer>
</template>
