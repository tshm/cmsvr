<script>
  import '../app.scss';
  import { view } from '$lib/store';
</script>

<main>
  <nav class={$view === 'PageView' ? 'hidden' : ''}>
    <a class="title" href="/BookShelf">
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
  nav {
    .title {
      margin: 0 var(--gap);
      text-decoration: none;
      h1 {
        margin: 0;
      }
    }
    ul {
      margin: var(--gap);
    }
  }
  .hidden {
    display: none;
  }
</style>
