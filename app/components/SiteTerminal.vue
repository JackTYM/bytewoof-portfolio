<script setup lang="ts">
const { boop, total, bytesLabel } = useBoops()

function pet() {
  boop()
}
</script>

<template>
  <section id="terminal" style="scroll-margin-top:84px; padding:78px 20px; border-bottom:2.5px solid var(--line-ink); background:var(--surface-sunken);">
    <div style="max-width:780px; margin:0 auto;">
      <!-- badge -->
      <div style="display:inline-flex; align-items:center; gap:8px; font-family:var(--font-mono); font-weight:700; font-size:12px; padding:6px 13px; border:2.5px solid var(--line-ink); border-radius:999px; background:var(--ink-950); color:var(--green-400); box-shadow:2.5px 2.5px 0 var(--line-ink);">
        <span style="width:8px;height:8px;border-radius:50%;background:var(--green-500);"></span>
        the nerdy side
      </div>
      <h2 style="font-family:var(--font-display); font-weight:800; font-size:clamp(28px,4.4vw,40px); letter-spacing:-.02em; color:var(--text-strong); margin:14px 0 20px;">~/byte</h2>

      <!-- terminal window -->
      <div style="position:relative; border:2.5px solid var(--line-ink); border-radius:14px; overflow:hidden; box-shadow:5px 5px 0 var(--line-ink); background:var(--ink-950); color:var(--cream-100); font-family:var(--font-mono);">
        <!-- title bar -->
        <div style="display:flex; align-items:center; gap:9px; padding:10px 14px; border-bottom:2px solid rgba(240,220,196,.16); background:rgba(0,0,0,.25);">
          <span style="width:11px;height:11px;border-radius:50%;background:var(--blush-500);"></span>
          <span style="width:11px;height:11px;border-radius:50%;background:var(--amber-500);"></span>
          <span style="width:11px;height:11px;border-radius:50%;background:var(--green-500);"></span>
          <span style="font-size:12px; opacity:.7; margin-left:4px;">byte@nightowl: ~</span>
        </div>

        <!-- body -->
        <div style="padding:17px 18px 22px; font-size:14px; line-height:1.75; position:relative;">
          <div><span style="color:var(--blue-400); user-select:none;">$</span> <span style="color:#fff; font-weight:600;">whoami</span></div>
          <div style="opacity:.92;">byte — wolfdog · he/him · software engineer 🌙</div>

          <div style="margin-top:6px;"><span style="color:var(--blue-400); user-select:none;">$</span> <span style="color:#fff; font-weight:600;">ls ~/byte</span></div>
          <div style="opacity:.92;">
            <span style="color:var(--blue-300);">about/</span>&#32;&#32;
            <span style="color:var(--blue-300);">work/</span>&#32;&#32;
            <span style="color:var(--blue-300);">art/</span>&#32;&#32;
            <span style="color:var(--blue-300);">socials/</span>&#32;&#32;
            status.txt
          </div>

          <div style="margin-top:6px;"><span style="color:var(--blue-400); user-select:none;">$</span> <span style="color:#fff; font-weight:600;">cat status.txt</span></div>
          <div style="opacity:.92;">night owl. shy at first, warm fast. <span style="color:var(--green-400);"># open to work</span></div>

          <div style="margin-top:6px;"><span style="color:var(--blue-400); user-select:none;">$</span> <span style="color:#fff; font-weight:600;">uptime</span></div>
          <div style="opacity:.92;">awake 19h · claude sessions: <span style="color:var(--amber-500);">4</span> · regrets: 0</div>

          <div style="margin-top:6px;">
            <span style="color:var(--blue-400); user-select:none;">$</span>
            <button
              type="button"
              @click="pet"
              style="all:unset; cursor:pointer; color:#fff; font-weight:600; border-bottom:1.5px dashed var(--blue-400);"
            >sudo pet byte</button>
          </div>
          <div style="opacity:.92; color:var(--blush-400);">
            ♥ *tail wag* — boop #<span style="color:var(--blush-300); font-weight:700;">{{ total.toLocaleString() }}</span> recorded
            <span style="color:rgba(240,220,196,.45); font-size:12px;">(≈ {{ bytesLabel(total) }})</span>
            <span data-loop style="display:inline-block; width:8px; height:1.05em; vertical-align:-2px; margin-left:5px; background:var(--blue-400); animation:byteBlink 1.1s steps(1) infinite;"></span>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>
