import { browser } from '$app/env';

/** device screen resolution fallback of 500 */
export const resolution = browser ? window.screen.availWidth : 500;
