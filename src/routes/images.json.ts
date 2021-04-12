import { lstatSync, readdirSync, Dirent } from 'fs';
import { join } from 'path';
import type { RequestHandler } from '@sveltejs/kit';
import type { Entity, Bookshelf, Book, Page } from '$lib/Entity';
const baseDir = 'contents';
const supportedImageExtension = ['jpg', 'jpeg', 'png'];
const supportedArchiveExtension = ['cbr', 'cbz', 'zip', 'rar'];

const ls = (dir: string) => readdirSync(join(baseDir, dir), { withFileTypes: true });

const extensionRegex = new RegExp('.*\\.([^.]+)');
const extractExtension = (filename: string) => filename.replace(extensionRegex, '$1');

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

const toBook = (dir: string) => (ent: Dirent): Book | null => {
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
		cover: toPage(path)(file)
	};
};

const toPage = (dir: string) => (dirent: Dirent): Page | null => {
	if (!isImage(dirent)) return null;
	return { type: 'page', name: dirent.name, path: join('/', dir, dirent.name) };
};

const toBookshelf = (dir: string) => (dirent: Dirent): Bookshelf | null => {
	if (!dirent.isDirectory()) return null;
	const path = `${dir}/${dirent.name}`;
	const dirents = ls(path);
	const books = dirents.map(toBook(path)).filter((i) => i);
	if (books.length === 0) return null;
	return {
		type: 'bookshelf',
		name: dirent.name,
		path,
		books
	};
};

const toEntity = (dir: string) => (dirent: Dirent): Entity | null =>
	toPage(dir)(dirent) ?? toBook(dir)(dirent) ?? toBookshelf(dir)(dirent);

export function getEntities(path: string = ''): Entity[] {
	if (lstatSync(join(baseDir, path)).isFile()) {
		path = `${path}/..`;
	}
	const dirents = ls(path);
	const items = dirents.map(toEntity(path)).filter((ent) => ent);
	return items;
}

export const get: RequestHandler<any, Entity[]> = async ({ query }) => {
	const path = query.get('path') ?? undefined;
	const entities = getEntities(path);
	if (entities) {
		return {
			body: {
				entities
			}
		};
	}
};
