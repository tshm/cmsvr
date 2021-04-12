<script context="module" lang="ts">
	import type { Page } from '$lib/Entity';
	import type { Load } from '@sveltejs/kit';
	import { isPage } from '$lib/Entity';

	export const load: Load = async ({ page, fetch }) => {
		const path = page.query.get('path') ?? '';
		const res = await fetch(`/images.json?path=${path}`);
		const pages = (await res.json()).entities.filter(isPage) as Page[];
		const pagenum = pages.findIndex((i) => i.path === path);
		console.info({ path, pages, pagenum });

		if (res.ok) {
			return {
				props: { pages, pagenum: pagenum < 0 ? 0 : pagenum }
			};
		}
		return {
			status: 400,
			error: new Error(`Could not load ${page}`)
		};
	};
</script>

<script lang="ts">
	import Image from '$lib/Image.svelte';

	export let pagenum = 1;
	export let pages: Page[];
	$: page = pages[pagenum];

	function handleClick(ev: any) {
		console.info(ev);
		if (pagenum === pages.length - 1) {
			console.log('finished');
			history.back();
			return;
		}
		pagenum++;
	}
</script>

<div on:click={handleClick}>
	<Image largeview path={page.path} alt="test" />
</div>
