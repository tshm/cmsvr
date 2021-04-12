<script lanst="ts">
	export let path = 'unknown';
	export let alt = 'unknown';
	export let largeview = false;
	$: src = `/contents${path}`;
	// $: console.log({ src })
</script>

<img class="{largeview ? 'largeview' : ''}" {src} {alt} />

<style lang="scss">
	img {
		width: 100%;
	}
	.largeview {
    width: 100%;
  }
</style>
