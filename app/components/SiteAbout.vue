<template>
  <section id="about" style="scroll-margin-top:84px; padding:78px 20px; border-bottom:2.5px solid var(--line-ink);">
    <div style="max-width:1120px; margin:0 auto;">
      <!-- badge -->
      <div style="display:inline-flex; align-items:center; gap:8px; font-family:var(--font-mono); font-weight:700; font-size:12px; padding:6px 13px; border:2.5px solid var(--line-ink); border-radius:999px; background:var(--byte-blue); color:#06283A; box-shadow:2.5px 2.5px 0 var(--line-ink);">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width:14px;height:14px"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z"/></svg>
        about byte
      </div>
      <h2 style="font-family:var(--font-display); font-weight:800; font-size:clamp(30px,5vw,46px); line-height:1.04; letter-spacing:-.02em; color:var(--text-strong); margin:14px 0 0;">a nerdy, excitable wolfdog</h2>

      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:24px; margin-top:30px; align-items:start;">

        <!-- the short version -->
        <div style="border:3px solid var(--line-ink); border-radius:28px; background:var(--surface-card); box-shadow:5px 5px 0 var(--line-ink); padding:26px;">
          <h3 style="font-family:var(--font-display); font-weight:800; font-size:21px; color:var(--text-strong); margin:0 0 10px;">the short version</h3>
          <p style="font-size:15px; line-height:1.6; color:var(--text-body); margin:0 0 18px;">i'm a wolfdog and a software engineer. i stay up late, sleep in, and like building cool things. a little shy, but i warm up fast.</p>
          <div style="display:flex; flex-direction:column;">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:9px 0;">
              <span style="font-family:var(--font-mono); font-size:12.5px; color:var(--text-muted);">species</span>
              <span style="font-family:var(--font-body); font-weight:800; font-size:14px; color:var(--text-strong);">wolfdog</span>
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:9px 0; border-top:2px dashed var(--line-hairline);">
              <span style="font-family:var(--font-mono); font-size:12.5px; color:var(--text-muted);">pronouns</span>
              <span style="font-family:var(--font-body); font-weight:800; font-size:14px; color:var(--text-strong);">he/him</span>
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:9px 0; border-top:2px dashed var(--line-hairline);">
              <span style="font-family:var(--font-mono); font-size:12.5px; color:var(--text-muted);">role</span>
              <span style="font-family:var(--font-body); font-weight:800; font-size:14px; color:var(--text-strong);">software engineer</span>
            </div>
          </div>
        </div>

        <!-- things i nerd out on -->
        <div style="border:3px solid var(--line-ink); border-radius:28px; background:var(--surface-card); box-shadow:5px 5px 0 var(--line-ink); padding:26px;">
          <h3 style="font-family:var(--font-display); font-weight:800; font-size:21px; color:var(--text-strong); margin:0 0 8px;">things i nerd out on</h3>
          <p style="font-size:14.5px; line-height:1.55; color:var(--text-muted); margin:0 0 18px;">currently: scraping data from ticketing platforms. things that pull me in:</p>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            <span style="display:inline-flex; align-items:center; font-family:var(--font-mono); font-weight:600; font-size:12.5px; padding:6px 12px; border:2px solid var(--line-ink); border-radius:999px; background:var(--surface-sunken); color:var(--text-strong);">linux</span>
            <span style="display:inline-flex; align-items:center; gap:5px; font-family:var(--font-mono); font-weight:600; font-size:12.5px; padding:6px 12px; border:2px solid var(--line-ink); border-radius:999px; background:var(--blue-300); color:#0E4763;">
              <svg viewBox="0 0 24 24" fill="currentColor" style="width:13px;height:13px"><path d="M11 21h-1l1-7H6.6c-.9 0-.5-.78-.48-.82C7.55 10.6 9.35 7.5 12 3h1l-1 7h4.5c.42 0 .64.2.42.66C13.9 14.8 11 21 11 21Z"/></svg>
              rust
            </span>
            <span style="display:inline-flex; align-items:center; font-family:var(--font-mono); font-weight:600; font-size:12.5px; padding:6px 12px; border:2px solid var(--line-ink); border-radius:999px; background:var(--surface-sunken); color:var(--text-strong);">vue</span>
            <span style="display:inline-flex; align-items:center; font-family:var(--font-mono); font-weight:600; font-size:12.5px; padding:6px 12px; border:2px solid var(--line-ink); border-radius:999px; background:var(--surface-sunken); color:var(--text-strong);">typescript</span>
            <span style="display:inline-flex; align-items:center; font-family:var(--font-mono); font-weight:600; font-size:12.5px; padding:6px 12px; border:2px solid var(--line-ink); border-radius:999px; background:var(--surface-sunken); color:var(--text-strong);">scraping</span>
            <span style="display:inline-flex; align-items:center; font-family:var(--font-mono); font-weight:600; font-size:12.5px; padding:6px 12px; border:2px solid var(--line-ink); border-radius:999px; background:var(--surface-sunken); color:var(--text-strong);">gaming</span>
            <span style="display:inline-flex; align-items:center; font-family:var(--font-mono); font-weight:600; font-size:12.5px; padding:6px 12px; border:2px solid var(--line-ink); border-radius:999px; background:var(--surface-sunken); color:var(--text-strong);">bypassing</span>
            <span style="display:inline-flex; align-items:center; font-family:var(--font-mono); font-weight:600; font-size:12.5px; padding:6px 12px; border:2px solid var(--line-ink); border-radius:999px; background:var(--surface-sunken); color:var(--text-strong);">reverse engineering</span>
            <span style="display:inline-flex; align-items:center; gap:5px; font-family:var(--font-mono); font-weight:600; font-size:12.5px; padding:6px 12px; border:2px solid var(--line-ink); border-radius:999px; background:var(--blush-300); color:#6B273C;">
              <svg viewBox="0 0 24 24" fill="currentColor" style="width:13px;height:13px"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z"/></svg>
              claude
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
