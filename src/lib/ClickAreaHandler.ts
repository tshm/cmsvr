import type { PagingConfig } from './Config';
import type { Page } from './Entity';

export const Command = {
  GoHome: 'GOHOME',
  PrevPage: 'PREVPAGE',
  NextPage: 'NEXTPAGE',
  Backup: 'BACKUP',
  ViewState: 'VIEWSTATE',
  NoOp: 'NOOP',
} as const;
export type Command = typeof Command[keyof typeof Command];

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  origin: Point;
  size: Point;
}

export interface ReadingState {
  pagenum: number;
  pages: Page[];
}

export const parseClick = (config: PagingConfig) => (rect: Rect) => (
  clickPoint: Point,
  state: ReadingState,
): Command => {
  const cmd = point2Command(config)(rect)(clickPoint);
  if (cmd === Command.NextPage && state.pagenum === state.pages.length - 1) {
    return Command.Backup;
  } else if (cmd === Command.PrevPage && state.pagenum === 0) {
    return Command.Backup;
  }
  return cmd;
};

export const point2Command = (config: PagingConfig) => (rect: Rect) => (
  clickPoint: Point,
): Command => {
  const x = (100 * (clickPoint.x - rect.origin.x)) / rect.size.x;
  const y = (100 * (clickPoint.y - rect.origin.y)) / rect.size.y;
  if (y < config.topAreaHeightPercent) return Command.GoHome;
  if (y > 100 - config.bottomAreaHeightPercent) return Command.Backup;
  const centerHalfWidth = 0.5 * config.middleWidthPercent;
  if (50 - centerHalfWidth <= x && x <= 50 + centerHalfWidth)
    return Command.ViewState;
  if (x < 50 - centerHalfWidth) return Command.PrevPage;
  if (x > 50 + centerHalfWidth) return Command.NextPage;
  return Command.NoOp;
};
