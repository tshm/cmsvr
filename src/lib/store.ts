import { writable } from 'svelte/store';
import type { PagingConfig } from './Config';
import { browser } from '$app/env';

let initialConfig: PagingConfig = {
  topAreaHeightPercent: 10,
  bottomAreaHeightPercent: 10,
  middleWidthPercent: 20,
};

const pagingConfigKey = 'pagingConfig';
if (browser) {
  try {
    initialConfig =
      JSON.parse(window.localStorage.getItem(pagingConfigKey)) ?? initialConfig;
  } finally {
    console.log('not browser');
  }
}
export const config = writable(initialConfig);
config.subscribe((configValue) => {
  if (!browser) return;
  window.localStorage.setItem(pagingConfigKey, JSON.stringify(configValue));
});

export type NavMode = 'Bookshelf' | 'PageView';
export const view = writable<NavMode>('Bookshelf');

export type ViewFitMode = 'horizontal-fit' | 'vertical-fit';
export const viewfitmode = writable<ViewFitMode>('horizontal-fit');

let readSet: string[] = browser
  ? JSON.parse(window.localStorage.getItem('read'))
  : [];
export const isRead = (path: string): boolean =>
  readSet?.includes(path) ?? false;
export const setRead = (path: string): boolean => {
  const set = new Set([...readSet, path]);
  readSet = [...set];
  if (browser) window.localStorage.setItem('read', JSON.stringify(readSet));
  return true;
};
