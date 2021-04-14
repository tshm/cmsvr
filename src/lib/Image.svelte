<script lanst="ts">
	export let data = 'unknown';
	export let alt = 'unknown';
	export let viewfitmode = 'none';
	// $: console.log({ viewfitmode });
</script>

<img class={viewfitmode} src={data} {alt} />

<style lang="scss">
	img {
		object-fit: contain;
		overflow: hidden;
	}
	.none {
		width: 100%;
		height: 100%;
	}
	.horizontal-fit {
		max-width: 100vw;
		width: 100%;
	}
	.vertical-fit {
		max-height: 100vw;
		height: 100%;
	}
</style>
