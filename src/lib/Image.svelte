<script lang="ts">
  import { resolution } from '$lib/DeviceResolution';
  import { browser } from '$app/env';

  export let path = '';
  export let alt = 'unknown';
  export let viewfitmode = 'none';
  $: console.log({ viewfitmode, path });
  $: fetchImage = (async () => {
    if (!browser || !path) return '';
    console.log('fetching: ', path);
    const response = await fetch(
      `/imagedata.json?path=${path}&resolution=${resolution}`,
    );
    const body = await response.json();
    return body?.data;
  })();
</script>

{#await fetchImage}
  <p>....</p>
{:then data}
  <img class={viewfitmode} src={data} {alt} />
{/await}

<style lang="scss">
  img {
    object-fit: cover;
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
    max-height: 100vh;
    height: 100%;
  }
</style>
