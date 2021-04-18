<script>
  import '../app.scss';
  import { view } from '$lib/store';
</script>

<main>
  <nav class={$view === 'PageView' ? 'hidden' : ''}>
    <a href="/BookShelf">
      <h1>CMView</h1>
    </a>
    <ul>
      <li>
        <a href="/Config">
          <span class="material-icons">settings</span>
        </a>
      </li>
    </ul>
  </nav>
  <slot />
</main>

<style lang="scss">
  nav.hidden {
    display: none;
  }

  nav a {
    text-decoration: none;
  }
</style>
