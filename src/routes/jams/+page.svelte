<script>
  import { gameJams } from "$lib/data.js";
  import { onMount } from "svelte";

  // ─── Link preview state ───────────────────────────────────────────────────
  // previews[url] = "loading" | { title, description, image } | "error"
  let previews = $state({});

  async function fetchPreview(url) {
    if (previews[url] !== undefined) return;
    previews[url] = "loading";

    try {
      const res = await fetch(`/api/og?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      previews[url] = data;
    } catch {
      previews[url] = "error";
    }
  }

  onMount(() => {
    gameJams.forEach((jam) => {
      if (jam.link) fetchPreview(jam.link);
    });
  });

  // ─── Mouse-following preview ──────────────────────────────────────────────
  let hoveredJam = $state(null);
  let mouseX = $state(0);
  let mouseY = $state(0);
  let windowW = $state(0);
  let windowH = $state(0);

  function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function handleMouseEnter(jam) {
    if (jam.link) hoveredJam = jam;
  }
  function handleMouseLeave() {
    hoveredJam = null;
  }

  // ─── Border sheen ─────────────────────────────────────────────────────────
  function handleCardMouseMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width)  * 100}%`);
    card.style.setProperty("--my", `${((e.clientY - rect.top)  / rect.height) * 100}%`);
  }
  function handleCardMouseLeave(e) {
    handleMouseLeave();
    e.currentTarget.style.removeProperty("--mx");
    e.currentTarget.style.removeProperty("--my");
  }

  // Keep preview inside the viewport
  let previewLeft = $derived(
    mouseX + 24 + 280 > windowW ? mouseX - 280 - 12 : mouseX + 24
  );
  let previewTop = $derived(
    mouseY - 10 + 280 > windowH ? windowH - 290 : mouseY - 10
  );

  // Unique years, descending
  let years = $derived(
    [...new Set(gameJams.map((j) => j.year))].sort((a, b) => b - a)
  );
</script>

<svelte:head>
  <title>David Arsovski | Game Jams</title>
</svelte:head>

<svelte:window
  onmousemove={handleMouseMove}
  bind:innerWidth={windowW}
  bind:innerHeight={windowH}
/>

<!-- ─── Floating link preview ─────────────────────────────────────────────── -->
{#if hoveredJam && previews[hoveredJam.link] && previews[hoveredJam.link] !== "loading" && previews[hoveredJam.link] !== "error"}
  {@const p = previews[hoveredJam.link]}
  <div
    class="link-preview"
    style="left:{previewLeft}px; top:{previewTop}px;"
    aria-hidden="true"
  >
    {#if p.image}
      <img class="preview-img" src={p.image} alt="" loading="lazy" />
    {:else}
      <div class="preview-img-placeholder">
        <span class="preview-domain">{new URL(hoveredJam.link).hostname}</span>
      </div>
    {/if}
    <div class="preview-body">
      <span class="preview-title">{p.title ?? hoveredJam.title}</span>
      {#if p.description}
        <span class="preview-desc">{p.description}</span>
      {/if}
      <span class="preview-domain">{new URL(hoveredJam.link).hostname}</span>
    </div>
  </div>
{/if}

<!-- ─── Page header ───────────────────────────────────────────────────────── -->
<section class="page-header animate-up delay-1">
  <a href="/" class="back-link">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M12 7H2M2 7L6 3M2 7L6 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    Back
  </a>
  <h1>Game Jams</h1>
  <p class="page-bio">
    {gameJams.length} entries across Global Game Jam and other events —
    solo and team efforts ranging from 2D platformers to experimental card games.
  </p>
</section>

<!-- ─── Jam entries grouped by year ─────────────────────────────────────── -->
{#each years as year, i}
  {@const jamsInYear = gameJams.filter((j) => j.year === year)}
  <section class="year-group animate-up" style="animation-delay:{0.15 + i * 0.07}s">
    <h2>{year}</h2>
    <div class="list-container">
      {#each jamsInYear as jam}
        <a
          href={jam.link}
          target="_blank"
          rel="noopener noreferrer"
          class="list-item interactive-card"
          onmouseenter={() => handleMouseEnter(jam)}
          onmouseleave={handleCardMouseLeave}
          onmousemove={handleCardMouseMove}
        >
          <div class="card-content">
            <div class="item-header">
              <h3>{jam.title}</h3>
              <span class="external-arrow" aria-hidden="true">↗</span>
            </div>
            <span class="category">{jam.event}</span>
            <p>{jam.description}</p>

            <!-- Dots while OG data is loading -->
            {#if previews[jam.link] === "loading"}
              <div class="preview-loading" aria-hidden="true">
                <span></span><span></span><span></span>
              </div>
            {/if}
          </div>
        </a>
      {/each}
    </div>
  </section>
{/each}

<style>
  /* ─── ANIMATIONS ─────────────────────────────────────────────────────────── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(15px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes previewIn {
    from { opacity: 0; transform: scale(0.94) translateY(6px); }
    to   { opacity: 1; transform: scale(1)    translateY(0); }
  }

  @keyframes dotBounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
    40%           { transform: translateY(-5px); opacity: 1; }
  }

  .animate-up {
    opacity: 0;
    animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .delay-1 { animation-delay: 0.1s; }

  /* ─── PAGE HEADER ────────────────────────────────────────────────────────── */
  .page-header { margin-bottom: 4rem; }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: monospace;
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-bottom: 1.5rem;
    position: relative;
    transition: color 0.2s ease, gap 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .back-link::after {
    content: "";
    position: absolute;
    bottom: -2px; left: 0;
    width: 0;
    height: 1px;
    background: var(--brand);
    transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .back-link:hover { color: var(--brand); gap: 0.65rem; }
  .back-link:hover::after { width: 100%; }
  .back-link svg { transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
  .back-link:hover svg { transform: translateX(-3px); }

  .page-header h1 {
    font-size: 2.5rem;
    letter-spacing: -0.03em;
    line-height: 1.2;
    margin-bottom: 1rem;
  }
  .page-bio {
    color: var(--text-muted);
    max-width: 500px;
    font-size: 1rem;
  }

  /* ─── YEAR GROUP ─────────────────────────────────────────────────────────── */
  .year-group {
    margin-bottom: 4rem;
    scroll-margin-top: 4rem;
  }
  .year-group h2 {
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
    padding-bottom: 0.5rem;
  }

  /* ─── LIST & CARDS ───────────────────────────────────────────────────────── */
  .list-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .list-item {
    display: block;
    padding: 1.5rem;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: transparent;
    position: relative;
    overflow: hidden;
  }

  .interactive-card {
    transition:
      transform       0.3s cubic-bezier(0.16, 1, 0.3, 1),
      border-color    0.3s ease,
      background-color 0.3s ease;
  }

  .interactive-card::before {
    content: "";
    position: absolute;
    top: 0; left: 0;
    width: 3px; height: 100%;
    background: var(--brand);
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 3;
  }

  .interactive-card:hover {
    transform: translateY(-3px);
    border-color: var(--brand-dim);
    background-color: var(--brand-dim);
  }
  .interactive-card:hover::before {
    transform: scaleY(1);
    transform-origin: top;
  }

  /* ─── BORDER SHEEN ───────────────────────────────────────────────────────── */
  .list-item {
    isolation: isolate;
  }

  .list-item::after {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    pointer-events: none;
    z-index: 0;
    opacity: 0;
    background: radial-gradient(
      220px circle at var(--mx, 50%) var(--my, 50%),
      color-mix(in srgb, var(--brand) 18%, transparent),
      transparent 70%
    );
    transition: opacity 0.35s ease;
  }

  .list-item:hover::after {
    opacity: 1;
  }

  .card-content { position: relative; z-index: 2; }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.25rem;
  }
  .item-header h3 {
    font-size: 1.1rem;
    transition: color 0.2s ease;
  }
  .interactive-card:hover .item-header h3 { color: var(--brand); }

  /* ↗ arrow slides in diagonally */
  .external-arrow {
    font-family: monospace;
    font-size: 1rem;
    color: var(--text-muted);
    opacity: 0;
    transform: translate(-4px, 4px);
    transition:
      opacity   0.25s ease,
      transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
      color     0.2s  ease;
    flex-shrink: 0;
  }
  .interactive-card:hover .external-arrow {
    opacity: 1;
    transform: translate(0, 0);
    color: var(--brand);
  }

  .category {
    font-size: 0.8rem;
    color: var(--text-muted);
    font-family: monospace;
    display: inline-block;
    margin-bottom: 1rem;
    transition: color 0.2s ease;
  }
  .interactive-card:hover .category { color: var(--brand); }

  .list-item p {
    margin: 0;
    font-size: 0.95rem;
    color: var(--text);
  }

  /* ─── LOADING DOTS ───────────────────────────────────────────────────────── */
  .preview-loading {
    display: flex;
    gap: 4px;
    margin-top: 0.75rem;
  }
  .preview-loading span {
    display: block;
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--brand);
    animation: dotBounce 1.1s ease infinite;
  }
  .preview-loading span:nth-child(2) { animation-delay: 0.18s; }
  .preview-loading span:nth-child(3) { animation-delay: 0.36s; }

  /* ─── FLOATING PREVIEW CARD ──────────────────────────────────────────────── */
  .link-preview {
    position: fixed;
    z-index: 1000;
    width: 280px;
    background: #111111;
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    pointer-events: none;
    box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.7),
      0 0 0 1px rgba(255, 255, 255, 0.05);
    animation: previewIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .preview-img {
    width: 100%;
    height: 152px;
    object-fit: cover;
    display: block;
    border-bottom: 1px solid var(--border);
  }

  .preview-img-placeholder {
    width: 100%;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1a1a1a;
    border-bottom: 1px solid var(--border);
  }

  .preview-body {
    padding: 0.8rem 1rem 0.9rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .preview-title {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
  }

  .preview-desc {
    font-size: 0.77rem;
    color: var(--text-muted);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .preview-domain {
    font-size: 0.73rem;
    color: var(--brand);
    font-family: monospace;
    margin-top: 0.1rem;
    opacity: 0.8;
  }

  /* ─── RESPONSIVE ─────────────────────────────────────────────────────────── */
  @media (max-width: 600px) {
    .page-header h1 { font-size: 2rem; }
    .item-header { flex-direction: column; gap: 0.2rem; }
    /* Floating preview doesn't work on touch — hide it */
    .link-preview { display: none; }
  }
</style>