<script lang="ts">
	import "../thumbnail.scss"
	import type { Book } from './Entity';
	import Image from '$lib/Image.svelte';
	export let book: Book;
	$: console.log({ book })
</script>

<card class="thumbnail">
	<Image path={book.cover.path} alt={book.name} />
</card>
<span class="title">{book.name}</span>