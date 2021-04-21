<script lang="ts">
  import '../thumbnail.scss';
  import type { Bookshelf } from './Entity';
  import Image from '$lib/Image.svelte';
  import CheckMark from './CheckMark.svelte';

  export let bookshelf: Bookshelf;
  $: console.log({ items: bookshelf.items.length });
</script>

<card class="thumbnail">
  <div>
    <Image data={bookshelf.cover.data} alt={bookshelf.name} />
    <CheckMark path={bookshelf.path} />
  </div>
</card>
<span class="title">{bookshelf.name}</span>

<style lang="scss">
  div {
    border: solid 2px yellow;
  }
</style>
