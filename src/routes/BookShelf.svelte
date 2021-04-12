<script context="module" lang="ts">
	import type { Entity } from '$lib/Entity';
	import type { Load } from '@sveltejs/kit';
	import { isBookshelf, isBook } from '$lib/Entity';

	export const load: Load = async ({ page, fetch }) => {
		const path = page.query.get('path') ?? '';
		// console.log('image list called', { fetch, path });
		const res = await fetch(`/images.json?path=${path}`);
		const items = (await res.json()).entities as Entity[];
		// console.log('load', { items });

		if (res.ok) {
			return {
				props: { items }
			};
		}
		return {
			status: 400,
			error: new Error(`Could not load ${page}`)
		};
	};
</script>

<script lang="ts">
	import BookStack from '$lib/BookStack.svelte';
	import BookCover from '$lib/BookCover.svelte';
	import Image from '$lib/Image.svelte';
	export let items: Entity[] = [];
	$: console.log({ items });
</script>

<div class="shelf">
	{#each items as item}
		<div class="book">
			{#if isBookshelf(item)}
				<a href={`/BookShelf?path=${item.path}`}>
					<BookStack bookshelf={item} />
				</a>
			{:else if isBook(item)}
				<a href={`/Book?path=${item.path}`}>
					<BookCover book={item} />
				</a>
			{:else}
				<a href={`/Book?path=${item.path}`}>
					<Image path={item.path} />
				</a>
			{/if}
		</div>
	{/each}
</div>

<style lang="scss">
	.shelf {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
		grid-gap: 0.5rem;
		justify-content: left;
		align-items: left;
		margin: auto;
		padding: 1rem;
	}
	.book {
		display: flex;
		align-items: center;
		flex-direction: column;
		width: 5rem;
		height: 7rem;
		background: #fff;
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
		border-radius: 5px;
		margin: auto;
		overflow: hidden;
	}
</style>
