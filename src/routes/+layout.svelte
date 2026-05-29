<script>
  import '../app.css';
</script>

<div class="layout">
  <nav>
    <a href="/" class="logo">David Arsovski.</a>
    <div class="links">
      <a href="#projects">projects</a>
      <a href="#education">education</a>
	  <a href="#jams">jams</a>
      <a href="#about">about</a>
      <a href="#contact">contact</a>
    </div>
  </nav>
  <main><slot /></main>
  <footer><p>© {new Date().getFullYear()} David Arsovski.</p></footer>
</div>

<style>
  .layout {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6rem;
    font-size: 0.9rem;
  }

  .logo {
    font-weight: 600;
    color: var(--brand); /* Make the logo pop */
  }

  .links { display: flex; gap: 1.5rem; }

  /* Animated underline for nav links */
  .links a {
    position: relative;
  }
  .links a::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: -2px;
    left: 0;
    background-color: var(--brand);
    transform: scaleX(0);
    transform-origin: bottom right;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .links a:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }

  main { flex: 1; }
  footer {
    margin-top: 6rem;
    font-size: 0.85rem;
    color: var(--text-muted);
  }
</style>