import { browser } from '$app/env';

/** device screen resolution fallback of 500 */
export const resolution = browser ? window.outerWidth : 500;
