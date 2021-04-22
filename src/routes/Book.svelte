<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';
  import type { Page } from '$lib/Entity';
  import { isPage } from '$lib/Entity';

  export const load: Load = async ({ page, fetch }) => {
    const path = page.query.get('path') ?? '';
    const res = await fetch(`/images.json?path=${path}`);
    const pages = (await res.json()).entities.filter(isPage) as Page[];
    const pagenum = pages.findIndex((i) => i.path === path) ?? 0;
    console.info({ path, pages: pages?.length, pagenum });

    if (res.ok) {
      return { props: { pages, pagenum: pagenum < 0 ? 0 : pagenum } };
    }
    console.error(`Could not load ${page}`);
    return { status: 400, error: new Error(`Could not load ${page}`) };
  };
</script>

<script lang="ts">
  import Image from '$lib/Image.svelte';
  import { Command, parseClick } from '$lib/ClickAreaHandler';
  import { config, view, viewfitmode } from '$lib/store';

  export let pagenum = 1;
  export let pages: Page[];
  $: console.log({ pagenum });
  $: page = pages[pagenum];
  $: totalPages = pages.length;

  view.set('PageView');

  function changeViewState() {
    console.log('viewstatechange');
    $viewfitmode =
      $viewfitmode === 'vertical-fit' ? 'horizontal-fit' : 'vertical-fit';
  }

  function handleClick(ev: MouseEvent) {
    const elem = ev.currentTarget as HTMLElement;
    const rect = {
      origin: { x: elem.clientLeft, y: elem.clientTop },
      size: { x: elem.clientWidth, y: elem.clientHeight },
    };
    const cmd = parseClick($config)(rect)(
      { x: ev.clientX, y: ev.clientY },
      { pages, pagenum },
    );
    if (pagenum === totalPages - 1) {
      console.log('mark book read');
      // setRead(book);
    }
    // console.info({ rect, ev, cmd, pagenum });
    switch (cmd) {
      case Command.NextPage:
        pagenum++;
        break;
      case Command.PrevPage:
        pagenum--;
        break;
      case Command.GoHome:
        document.location.href = '/';
        break;
      case Command.Backup:
        history.back();
        break;
      case Command.ViewState:
        changeViewState();
        break;
      default:
        console.warn('unhandled command', cmd);
    }
  }
</script>

<div id="book" on:click={handleClick}>
  <Image viewfitmode={$viewfitmode} path={page.path} alt={page.path} />
</div>
<div id="pagenum">{pagenum + 1} / {totalPages}</div>
<div id="cache">
  <Image path={pages[pagenum + 1]?.path} />
  <Image path={pages[pagenum - 1]?.path} />
</div>

<style lang="scss">
  #cache {
    visibility: collapse;
  }
  #book {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #pagenum {
    display: block;
    color: rgba(0, 0, 0, 0.5);
    margin-top: -2rem;
  }
</style>
