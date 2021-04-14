import { writable } from 'svelte/store';
import type { UIConfig } from './Config';

const defaultConfig: UIConfig = {
	topAreaHeightPercent: 10,
	bottomAreaHeightPercent: 10,
	middleWidthPercent: 20
};

export const config = writable(defaultConfig);

export type NavMode = 'Bookshelf' | 'PageView';

export const view = writable<NavMode>('Bookshelf');

export type ViewFitMode = 'horizontal-fit' | 'vertical-fit';
export const viewfitmode = writable<ViewFitMode>('horizontal-fit');
