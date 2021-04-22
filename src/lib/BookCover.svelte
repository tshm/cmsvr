<script lang="ts">
  import '../thumbnail.scss';
  import type { Book } from '$lib/Entity';
  import Image from '$lib/Image.svelte';
  import CheckMark from './CheckMark.svelte';

  export let book: Book;
  $: console.log({ book: book.path });
</script>

<card class="thumbnail">
  <Image path={book.cover.path} alt={book.name} />
  <CheckMark path={book.path} />
  <span class="title">{book.name}</span>
  <div id="pagenum">{book.pages}</div>
</card>

<style lang="scss">
  #pagenum {
    color: red;
  }
</style>
