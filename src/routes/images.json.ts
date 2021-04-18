import { lstatSync, readdirSync, Dirent } from 'fs';
import { join } from 'path';
import type { RequestHandler } from '@sveltejs/kit';
import type { Entity, Bookshelf, Book, Page } from '$lib/Entity';
import sharp from 'sharp';
const supportedImageExtension = ['jpg', 'jpeg', 'png'];
const supportedArchiveExtension = ['cbr', 'cbz', 'zip', 'rar'];

export const baseDir = (): string => 'contents';

const ls = (dir: string) =>
  readdirSync(join(baseDir(), dir), { withFileTypes: true });

const extensionRegex = new RegExp('.*\\.([^.]+)');
const extractExtension = (filename: string) =>
  filename.replace(extensionRegex, '$1');

const isImage = (ent: Dirent) => {
  if (!ent.isFile()) return false;
  const ext = extractExtension(ent.name);
  return supportedImageExtension.includes(ext);
};

const isImageArchive = (ent: Dirent) => {
  if (!ent.isFile()) return false;
  const ext = extractExtension(ent.name);
  return supportedArchiveExtension.includes(ext);
};

const toBook = (dir: string) => async (ent: Dirent): Promise<Book | null> => {
  if (ent.isFile() && !isImageArchive(ent)) return null;
  if (!ent.isDirectory()) return null;
  const path = join(dir, ent.name);
  const file = ls(path).find(isImage);
  const folderExist = ls(path).some((e) => e.isDirectory());
  if (!file || folderExist) return null;
  return {
    type: 'book',
    name: ent.name,
    path,
    cover: await toPage(path)(file),
  };
};

const toPage = (dir: string) => async (
  dirent: Dirent,
  resolution = 200,
): Promise<Page | null> => {
  if (!isImage(dirent)) return null;
  const bin = await sharp(join(baseDir(), dir, dirent.name))
    .resize({ width: resolution, fastShrinkOnLoad: true, fit: 'contain' })
    .toBuffer();
  const ext = dirent.name.match(/jpe?g/)
    ? 'jpeg'
    : dirent.name.match(/png/)
      ? 'png'
      : 'jpg';
  const data = `data:image/${ext};base64,${bin.toString('base64')}`;
  return {
    type: 'page',
    name: dirent.name,
    path: join('/', dir, dirent.name),
    data,
  };
};

const toBookshelf = (dir: string) => async (
  dirent: Dirent,
): Promise<Bookshelf | null> => {
  if (!dirent.isDirectory()) return null;
  const path = join(dir, dirent.name);
  const dirents = ls(path);
  const books = (await Promise.all(dirents.map(toBook(path)))).filter((i) => i);
  if (books.length === 0) return null;
  return {
    type: 'bookshelf',
    name: dirent.name,
    path,
    books,
  };
};

const toEntity = (dir: string, resolution: number) => async (
  dirent: Dirent,
): Promise<Entity | null> =>
  (await toPage(dir)(dirent, resolution)) ??
  (await toBook(dir)(dirent)) ??
  (await toBookshelf(dir)(dirent));

export async function getEntities(
  path = '',
  resolution = 200,
): Promise<Entity[]> {
  if (lstatSync(join(baseDir(), path)).isFile()) {
    path = `${path}/..`;
  }
  const dirents = ls(path);
  const items = (
    await Promise.all(dirents.map(toEntity(path, resolution)))
  ).filter((ent) => ent);
  return items;
}

export const get: RequestHandler<unknown, Entity[]> = async ({ query }) => {
  console.info('images.json called', { query });
  const path = query.get('path') ?? undefined;
  const resolution = query.get('resolution') ?? '500';
  const entities = await getEntities(path, +resolution);
  console.log({ len: entities.length });
  if (entities) {
    return {
      body: {
        entities,
      },
    };
  }
};
