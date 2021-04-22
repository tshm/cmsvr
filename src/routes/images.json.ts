import { lstatSync, readdirSync, Dirent } from 'fs';
import { join } from 'path';
import type { RequestHandler } from '@sveltejs/kit';
import type { Entity, Bookshelf, Book, Page } from '$lib/Entity';
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
  const subDirents = ls(path);
  const files = subDirents.filter(isImage);
  const folderExist = subDirents.some((e) => e.isDirectory());
  // console.log({ file, folderExist, path, book: !file || folderExist });
  if (files.length == 0 || folderExist) return null;
  return {
    type: 'book',
    name: ent.name,
    pages: files.length,
    path,
    cover: await toPage(path)(files[0]),
  };
};

const toPage = (dir: string) => async (
  dirent: Dirent,
): Promise<Page | null> => {
  if (!isImage(dirent)) return null;
  return {
    type: 'page',
    name: dirent.name,
    path: join('/', dir, dirent.name),
  };
};

const toBookshelf = (dir: string) => async (
  dirent: Dirent,
): Promise<Bookshelf | null> => {
  if (!dirent.isDirectory()) return null;
  const path = join(dir, dirent.name);
  const dirents = ls(path);
  const items = (await Promise.all(dirents.map(toEntity(path)))).filter(
    Boolean,
  );
  if (items.length === 0) return null;
  const covers = items
    .flatMap((i) => ('cover' in i ? i.cover : null))
    .filter(Boolean);
  if (!covers) return null;
  return {
    type: 'bookshelf',
    name: dirent.name,
    path,
    items,
    cover: covers[0],
  };
};

const toEntity = (dir: string) => async (
  dirent: Dirent,
): Promise<Entity | null> =>
  (await toPage(dir)(dirent)) ??
  (await toBook(dir)(dirent)) ??
  (await toBookshelf(dir)(dirent));

export async function getEntities(path = ''): Promise<Entity[]> {
  if (lstatSync(join(baseDir(), path)).isFile()) {
    path = `${path}/..`;
  }
  const dirents = ls(path);
  const items = (await Promise.all(dirents.map(toEntity(path)))).filter(
    Boolean,
  );
  return items;
}

export const get: RequestHandler<unknown, Entity[]> = async ({ query }) => {
  console.info('images.json called', { query });
  const path = query.get('path') ?? undefined;
  const entities = await getEntities(path);
  if (entities) {
    console.log({ len: entities.length });
    return { body: { entities } };
  }
};
