import { browser } from '$app/env';

/** device screen resolution */
export const resolution = browser ? window.outerWidth : 200;
