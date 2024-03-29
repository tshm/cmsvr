<script context="module" lang="ts">
  import type { Entity } from '$lib/Entity';
  import type { Load } from '@sveltejs/kit';
  import { isBookshelf, isBook } from '$lib/Entity';
  import { resolution } from '$lib/DeviceResolution';

  export const load: Load = async ({ page, fetch }) => {
    const path = page.query.get('path') ?? '';
    // console.log('image list called', { fetch, path });
    const res = await fetch(
      `/images.json?path=${path}&resolution=${resolution}`,
    );
    const items = (await res.json()).entities as Entity[];

    return res.ok
      ? {
          props: { items },
        }
      : {
          status: 400,
          error: new Error(`Could not load ${page}`),
        };
  };
</script>

<script lang="ts">
  import BookStack from '$lib/BookStack.svelte';
  import BookCover from '$lib/BookCover.svelte';
  import Image from '$lib/Image.svelte';
  import { view } from '$lib/store';

  export let items: Entity[] = [];
  $: console.log({ items: items.length });
  view.set('Bookshelf');
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
    --cardwidth: 10rem;
    --cardheight: calc(1.7 * var(--cardwidth));
    --gridgap: calc(3 * var(--gap));
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--cardwidth), 1fr));
    grid-gap: var(--gridgap);
    justify-content: left;
    align-items: left;
    margin: auto;
    padding: var(--gridgap);
    padding-top: 5rem;
    height: auto !important;

    a {
      text-decoration: none;
    }
  }

  .book {
    display: flex;
    align-items: center;
    flex-direction: column;
    // width: 100%;
    // height: 100%;
    width: var(--cardwidth);
    height: var(--cardheight);
    background: #fff;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
    border-radius: 5%;
    margin: auto;
    overflow: hidden;
  }
</style>
