<script>
  import {
    projects,
    education,
    gameJams,
    skills,
    languages,
    interests,
  } from "$lib/data.js";

  const imageModules = import.meta.glob("$lib/assets/images/*", {
    eager: true,
    import: "default",
  });

  const imageMap = {};
  for (const [path, url] of Object.entries(imageModules)) {
    const filename = path.split("/").pop();
    imageMap[filename] = url;
  }

  // Only show 3 jams as a teaser on the main page
  const featuredJams = gameJams.slice(0, 3);

  // ─── Border sheen: track mouse position per card ──────────────────────────
  function handleCardMouseMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty("--mx", `${x}%`);
    card.style.setProperty("--my", `${y}%`);
  }

  function handleCardMouseLeave(e) {
    // Reset so the gradient disappears cleanly
    e.currentTarget.style.removeProperty("--mx");
    e.currentTarget.style.removeProperty("--my");
  }
</script>

<svelte:head>
  <title>David Arsovski | Portfolio</title>
</svelte:head>

<section class="hero animate-up delay-1">
  <h1>Data Scientist.<br />Indie Game Developer.</h1>
  <p class="bio">
    Currently exploring machine learning applications while developing
    mechanics and custom shaders for modern game engines.
  </p>
</section>

<section id="projects" class="animate-up delay-3">
  <h2>Selected Work</h2>
  <div class="list-container">
    {#each projects as project}
      <article
        class="list-item interactive-card"
        class:has-images={project.images && project.images.length > 0}
        onmousemove={handleCardMouseMove}
        onmouseleave={handleCardMouseLeave}
      >
        <!-- Image panel: hidden by default, revealed on hover via CSS grid trick -->
        {#if project.images && project.images.length > 0}
          <div class="image-panel-grid" aria-hidden="true">
            <div class="image-panel-inner">
              <div class="carousel">
                {#each project.images as img}
                  <img src={imageMap[img]} alt="{project.title} screenshot" loading="lazy" />
                {/each}
              </div>
            </div>
          </div>
        {/if}

        <div class="card-content">
          <div class="item-header">
            <h3>{project.title}</h3>
            <span class="year">{project.year}</span>
          </div>

          <span class="category">{project.category}</span>
          <p>{project.description}</p>

          {#if project.link}
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              class="project-link"
            >
              View Live Project &rarr;
            </a>
          {/if}
        </div>
      </article>
    {/each}
  </div>
</section>

<section id="education" class="animate-up delay-2">
  <h2>Education</h2>
  <div class="list-container">
    {#each education as edu}
      <div
        class="list-item"
        onmousemove={handleCardMouseMove}
        onmouseleave={handleCardMouseLeave}
      >
        <div class="item-header">
          <h3>{edu.degree}</h3>
          <span class="year">{edu.year}</span>
        </div>
        <div class="institution">{edu.institution}</div>
        <p>{edu.description}</p>
        {#if edu.gpa}
          <div class="highlight-row">
            Cumulative GPA: <span class="badge glow">{edu.gpa} / 10.0</span>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</section>

<!-- ─── GAME JAMS TEASER ─────────────────────────────────────────────────── -->
<section id="jams" class="animate-up delay-4">
  <h2>Game Jams</h2>
  <div class="list-container">
    {#each featuredJams as jam}
      <a
        href={jam.link}
        target="_blank"
        rel="noopener noreferrer"
        class="list-item interactive-card"
        onmousemove={handleCardMouseMove}
        onmouseleave={handleCardMouseLeave}
      >
        <div class="card-content">
          <div class="item-header">
            <h3>{jam.title}</h3>
            <span class="year">{jam.year}</span>
          </div>
          <span class="category">{jam.event}</span>
          <p>{jam.description}</p>
        </div>
      </a>
    {/each}
  </div>

  <!-- Teaser link to full jams page -->
  <a href="/jams" class="see-all-link">
    <span class="see-all-inner">
      See all {gameJams.length} game jam entries
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
  </a>
</section>

<section id="about" class="animate-up delay-5">
  <h2>About</h2>
  <div class="about-grid">
    <div class="skills-section">
      <h3 class="sub-heading">Skills & Stack</h3>
      <div class="skills-grid">
        {#each skills as group}
          <div class="skill-group">
            <span class="skill-category">{group.category}</span>
            <div class="skill-tags">
              {#each group.items as item}
                <span class="skill-tag">{item}</span>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
    <div class="side-info">
      <div class="info-block">
        <h3 class="sub-heading">Languages</h3>
        <ul class="clean-list">
          {#each languages as lang}
            <li>{lang}</li>
          {/each}
        </ul>
      </div>
      <div class="info-block">
        <h3 class="sub-heading">Interests</h3>
        <ul class="clean-list">
          {#each interests as interest}
            <li class="interest-item">{interest}</li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</section>

<section id="contact" class="contact animate-up delay-6">
  <h2>Contact</h2>
  <p>Available for freelance work and collaborations.</p>
  <div class="socials">
    <a href="mailto:arsovskidavid4@gmail.com">Email ↗</a>
    <a href="https://github.com/arsovskii" target="_blank">GitHub ↗</a>
    <a href="https://www.linkedin.com/in/david-a-2783a6237/" target="_blank">LinkedIn ↗</a>
    <a href="https://arsovski3.itch.io/" target="_blank">Itch.io ↗</a>
  </div>
</section>

<style>
  /* ─── ANIMATIONS ─────────────────────────────────────────────────────────── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(15px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Slide in from the top (for image panel) */
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Shimmer sweep across skill tags */
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  /* Subtle pulse for interests */
  @keyframes softPulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.7; }
  }

  .animate-up {
    opacity: 0;
    animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .delay-1 { animation-delay: 0.1s; }
  .delay-2 { animation-delay: 0.2s; }
  .delay-3 { animation-delay: 0.3s; }
  .delay-4 { animation-delay: 0.4s; }
  .delay-5 { animation-delay: 0.5s; }
  .delay-6 { animation-delay: 0.6s; }

  /* ─── HERO ───────────────────────────────────────────────────────────────── */
  .hero { margin-bottom: 5rem; }
  .hero h1 {
    font-size: 2.5rem;
    letter-spacing: -0.03em;
    line-height: 1.2;
    margin-bottom: 1.5rem;
  }
  .bio {
    color: var(--text-muted);
    max-width: 500px;
    font-size: 1.1rem;
  }

  /* ─── SECTION ────────────────────────────────────────────────────────────── */
  section {
    margin-bottom: 6rem;
    scroll-margin-top: 4rem;
  }
  section h2 {
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    margin-bottom: 2rem;
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
    overflow: hidden;  /* needed for image-panel reveal */
  }

  .interactive-card {
    transition:
      transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
      border-color 0.3s ease,
      background-color 0.3s ease;
  }

  /* Left-edge accent line */
  .interactive-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
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

  /* ─── BORDER SHEEN ──────────────────────────────────────────────────────────
     A radial gradient spotlight that follows the mouse near the card border.
     --mx / --my are set in JS on mousemove. The gradient is painted on ::after
     and sits behind the card content but above the background, so it only
     affects the border region via a subtle glow bleed.
  ──────────────────────────────────────────────────────────────────────────── */
  .list-item {
    /* needed so ::after is clipped to card bounds */
    isolation: isolate;
  }

  .list-item::after {
    content: "";
    position: absolute;
    inset: -1px; /* sit exactly on top of the border */
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

  /* Only show the sheen when --mx is set (i.e. mouse is over the card) */
  .list-item:hover::after {
    opacity: 1;
  }

  /* ─── IMAGE PANEL (hidden until hover) ─────────────────────────────────────
     grid-template-rows: 0fr → 1fr animates to exact natural height.
     The inner div needs overflow:hidden for the grid trick to work.
  ──────────────────────────────────────────────────────────────────────────── */
  .image-panel-grid {
    display: grid;
    grid-template-rows: 0fr;
    opacity: 0;
    /* add a bottom margin in the open state via padding on inner */
    transition:
      grid-template-rows 0.48s cubic-bezier(0.16, 1, 0.3, 1),
      opacity            0.32s ease;
  }

  .image-panel-inner {
    overflow: hidden;
    /* padding-bottom creates the gap between image and card text.
       It's inside overflow:hidden so it only appears when the panel opens. */
    padding-bottom: 1.25rem;
  }

  .interactive-card:hover .image-panel-grid {
    grid-template-rows: 1fr;
    opacity: 1;
  }

  /* Images scale up subtly as they appear */
  .image-panel-inner .carousel img {
    transform: scale(0.98);
    transition: transform 0.48s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .interactive-card:hover .image-panel-inner .carousel img {
    transform: scale(1);
  }

  /* ─── CAROUSEL ───────────────────────────────────────────────────────────── */
  .carousel {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1rem;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .carousel::-webkit-scrollbar { display: none; }

  .carousel img {
    scroll-snap-align: start;
    flex: 0 0 100%;
    height: 230px;
    object-fit: cover;
    border-radius: 6px;
  }

  /* ─── CARD CONTENT ───────────────────────────────────────────────────────── */
  .card-content {
    position: relative;
    z-index: 2;
  }

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
  .interactive-card:hover .item-header h3 {
    color: var(--brand);
  }

  .year {
    font-family: monospace;
    color: var(--text-muted);
    font-size: 0.9rem;
    flex-shrink: 0;
  }

  /* Category tag — hover shimmer on the interactive card */
  .institution,
  .category {
    font-size: 0.8rem;
    color: var(--text-muted);
    font-family: monospace;
    display: inline-block;
    margin-bottom: 1rem;
    transition: color 0.2s ease;
  }
  .interactive-card:hover .category {
    color: var(--brand);
  }

  .list-item p {
    margin: 0;
    font-size: 0.95rem;
    color: var(--text);
  }

  /* ─── HIGHLIGHTS ─────────────────────────────────────────────────────────── */
  .highlight-row {
    margin-top: 1.25rem;
    font-size: 0.9rem;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .badge {
    background-color: var(--brand);
    color: var(--bg);
    padding: 0.2rem 0.6rem;
    border-radius: 3px;
    font-family: monospace;
    font-weight: 600;
    font-size: 0.85rem;
    box-shadow: 0 0 10px transparent;
    transition:
      box-shadow 0.3s ease,
      transform 0.3s ease;
  }

  .list-item:hover .badge.glow,
  .interactive-card:hover .badge {
    box-shadow: 0 0 12px var(--brand-dim);
    transform: scale(1.04);
  }

  /* ─── PROJECT LINK ───────────────────────────────────────────────────────── */
  .project-link {
    display: inline-block;
    margin-top: 1rem;
    font-size: 0.9rem;
    font-family: monospace;
    font-weight: 600;
    color: var(--brand);
    opacity: 0;
    transform: translateX(-6px);
    transition:
      opacity   0.3s ease,
      transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
      color     0.2s ease;
  }

  /* Reveal the link button only on hover */
  .interactive-card:hover .project-link {
    opacity: 1;
    transform: translateX(0);
  }

  .project-link:hover {
    color: var(--text);
  }

  /* ─── SEE-ALL JAMS LINK ──────────────────────────────────────────────────── */
  .see-all-link {
    display: inline-flex;
    margin-top: 1.75rem;
    color: var(--text-muted);
    font-size: 0.9rem;
    font-family: monospace;
    position: relative;
    transition: color 0.2s ease;
  }

  .see-all-inner {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* Animated underline */
  .see-all-link::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0%;
    height: 1px;
    background: var(--brand);
    transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .see-all-link:hover {
    color: var(--brand);
  }

  .see-all-link:hover::after {
    width: 100%;
  }

  .see-all-link svg {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .see-all-link:hover svg {
    transform: translateX(4px);
  }

  /* ─── ABOUT ──────────────────────────────────────────────────────────────── */
  .about-grid {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 3rem;
  }
  .sub-heading {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 1.5rem;
    font-family: monospace;
  }
  .skills-grid {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .skill-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .skill-category {
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  /* Skill tags — replace plain comma list */
  .skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  .skill-tag {
    font-size: 0.82rem;
    font-family: monospace;
    padding: 0.15rem 0.55rem;
    border: 1px solid var(--border);
    border-radius: 3px;
    color: var(--text-muted);
    background: transparent;
    cursor: default;
    transition:
      color           0.2s ease,
      border-color    0.2s ease,
      background-color 0.2s ease,
      transform       0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Shimmer + lift on individual tag hover */
  .skill-tag:hover {
    color: var(--brand);
    border-color: var(--brand);
    background-color: var(--brand-dim);
    transform: translateY(-2px);
  }

  .info-block { margin-bottom: 2.5rem; }
  .clean-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.95rem;
    color: var(--text);
  }

  /* Interests — hover glow */
  .interest-item {
    cursor: default;
    display: inline-block;
    transition: color 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
  }
  .interest-item::before {
    content: "→";
    display: inline-block;
    margin-right: 0.4rem;
    color: var(--brand);
    opacity: 0;
    transform: translateX(-4px);
    transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .interest-item:hover {
    color: var(--brand);
    transform: translateX(6px);
  }
  .interest-item:hover::before {
    opacity: 1;
    transform: translateX(0);
  }

  /* ─── CONTACT ────────────────────────────────────────────────────────────── */
  .contact p { margin-bottom: 1.5rem; }
  .socials {
    display: flex;
    gap: 1.5rem;
  }
  .socials a {
    font-family: monospace;
    font-size: 0.9rem;
    position: relative;
  }

  /* ─── RESPONSIVE ─────────────────────────────────────────────────────────── */
  @media (max-width: 768px) {
    .about-grid {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
  }
  @media (max-width: 600px) {
    .hero h1 { font-size: 2rem; }
    .item-header { flex-direction: column; }
    /* On touch devices: always show images (no hover state) */
    .image-panel-grid {
      grid-template-rows: 1fr;
      opacity: 1;
    }
    .image-panel-inner .carousel img {
      transform: scale(1);
    }
    .project-link {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>