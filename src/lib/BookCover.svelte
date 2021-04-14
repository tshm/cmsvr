<script lang="ts">
  import '../thumbnail.scss';
  import type { Book } from './Entity';
  import Image from '$lib/Image.svelte';
  import CheckMark from './CheckMark.svelte';

  export let book: Book;
  $: console.log({ book: book.path });
</script>

<card class="thumbnail">
  <Image data={book.cover.data} alt={book.name} />
  <CheckMark path={book.path} />
</card>
<span class="title">{book.name}</span>
