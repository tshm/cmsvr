import { isBook, isBookshelf, isPage } from '../lib/Entity';
import { getEntities } from './images.json';

describe('Images module', () => {
  it('should get all items under content root', async () => {
    const items = getEntities();
    expect(items.length).toBe(6);
    expect(items.filter(isBookshelf).length).toBe(1);
  });

  it('should get all images and folders', async () => {
    const items = getEntities('shelf1');
    expect(items.length).toBe(2);
    expect(items.filter(isBook).length).toBe(2);
  });

  it('should file and folder with different types', async () => {
    const items = getEntities('shelf1');
    expect(items.filter((i) => !!i['cover']).length).toBe(2);
  });

  it('should get images sub-folders', async () => {
    const items = getEntities('shelf1/book2');
    expect(items[0].path).toEqual('/shelf1/book2/duck.jpg');
  });

  it('should get sibling images if path is an image', async () => {
    const items = getEntities('shelf1/book1/dogs.jpg');
    expect(items.length).toBe(2);
    expect(items.filter(isPage).length).toBe(2);
  });
});
