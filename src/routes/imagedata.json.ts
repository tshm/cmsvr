import { join } from 'path';
import type { RequestHandler } from '@sveltejs/kit';
import sharp from 'sharp';
import { baseDir } from './images.json';

export const getImageData = async (
  path: string,
  resolution = 200,
): Promise<string> => {
  const bin = await sharp(join(baseDir(), path))
    .resize({ width: resolution, fastShrinkOnLoad: true, fit: 'contain' })
    .toBuffer();
  const ext = path.match(/jpe?g/) ? 'jpeg' : path.match(/png/) ? 'png' : 'jpg';
  return `data:image/${ext};base64,${bin.toString('base64')}`;
};

export const get: RequestHandler<unknown, string> = async ({ query }) => {
  console.info('imagedata.json called', { query });
  const path = query.get('path') ?? undefined;
  if (!path) return;
  const resolution = query.get('resolution') ?? '500';
  const data = await getImageData(path, +resolution);
  if (data) {
    console.log({ data_length: data.length });
    return { body: { data } };
  }
};
