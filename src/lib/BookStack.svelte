<script lang="ts">
	import "../thumbnail.scss"
	import type { Bookshelf } from './Entity';
	import Image from '$lib/Image.svelte';

	export let bookshelf: Bookshelf;
	$: book = bookshelf.books[0];
	$: console.log({ books: bookshelf.books });
</script>

<card class="thumbnail">
	<Image path={book.cover.path} alt={bookshelf.name} />
</card>
<span class="title">{bookshelf.name}</span>
