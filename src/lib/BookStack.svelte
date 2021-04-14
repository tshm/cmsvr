<script lang="ts">
	import "../thumbnail.scss"
	import type { Bookshelf } from './Entity';
	import Image from '$lib/Image.svelte';

	export let bookshelf: Bookshelf;
	$: book = bookshelf.books[0];
	$: console.log({ books: bookshelf.books });
</script>

<card class="thumbnail">
	<div>
		<Image data={book.cover.data} alt={bookshelf.name} />
	</div>
</card>
<span class="title">{bookshelf.name}</span>

<style lang="scss">
	div {
		border: solid 2px yellow;
	}
</style>
