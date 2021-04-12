export type Entity = Book | Page | Bookshelf;

type Named = {
	name: string;
	path: string;
};

/** collection of Books */
export type Bookshelf = Named & {
	type: 'bookshelf';
	books: Book[];
};

/** collection of Pages */
export type Book = Named & {
	type: 'book';
	cover: Page;
};

/** Page for an image */
export type Page = Named & {
	type: 'page';
};

export const isBookshelf = (item: Entity): item is Bookshelf => item.type === 'bookshelf';
export const isBook = (item: Entity): item is Book => item.type === 'book';
export const isPage = (item: Entity): item is Page => item.type === 'page';
