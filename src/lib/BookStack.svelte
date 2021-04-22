<script lang="ts">
  import '../thumbnail.scss';
  import type { Bookshelf } from './Entity';
  import Image from '$lib/Image.svelte';
  import CheckMark from './CheckMark.svelte';

  export let bookshelf: Bookshelf;
  $: numItems = bookshelf.items.length;
  $: console.log({ numItems });
</script>

<card class="thumbnail">
  <div id="main">
    <Image path={bookshelf.cover.path} alt={bookshelf.name} />
    <CheckMark path={bookshelf.path} />
  </div>
  <span class="title">{bookshelf.name}</span>
  <div id="pagenum">{numItems}</div>
</card>

<style lang="scss">
  #main {
    border: solid 2px yellow;
  }
  #pagenum {
    color: red;
  }
</style>
