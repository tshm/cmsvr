<script context="module" lang="ts">
  import type { Page } from '$lib/Entity';
  import type { Load } from '@sveltejs/kit';
  import { isPage } from '$lib/Entity';
  import { resolution } from '$lib/DeviceResolution';

  export const load: Load = async ({ page, fetch }) => {
    const path = page.query.get('path') ?? '';
    const res = await fetch(
      `/images.json?path=${path}&resolution=${resolution}`,
    );
    const pages = (await res.json()).entities.filter(isPage) as Page[];
    const pagenum = pages.findIndex((i) => i.path === path);
    console.info({ path, pages, pagenum });

    return res.ok
      ? {
          props: {
            pages,
            pagenum: pagenum < 0 ? 0 : pagenum,
          },
        }
      : {
          status: 400,
          error: new Error(`Could not load ${page}`),
        };
  };
</script>

<script lang="ts">
  import Image from '$lib/Image.svelte';
  import { Command, parseClick } from '$lib/ClickAreaHandler';
  import { config, view, viewfitmode } from '$lib/store';

  export let pagenum = 1;
  export let pages: Page[];
  $: page = pages[pagenum];

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
    if (pagenum === pages.length - 1) {
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
        console.log('unhandled command', cmd);
    }
  }
</script>

<div on:click={handleClick}>
  <Image viewfitmode={$viewfitmode} data={page.data} alt={page.path} />
</div>
