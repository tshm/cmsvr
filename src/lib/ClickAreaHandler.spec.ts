import * as hand from './ClickAreaHandler';
import type { PagingConfig } from './Config';

const config: PagingConfig = {
  topAreaHeightPercent: 20,
  bottomAreaHeightPercent: 20,
  middleWidthPercent: 30,
};

const windowArea: hand.Rect = {
  origin: { x: 0, y: 0 },
  size: { x: 100, y: 100 },
};

const detectRegion = hand.point2Command(config)(windowArea);

describe('click event', () => {
  it('should return GoHome if clicked on the top area', () => {
    const cmd = detectRegion({ x: 10, y: 5 });
    expect(cmd).toBe(hand.Command.GoHome);
  });

  it('should return PrevPage if clicked on the left area', () => {
    const cmd = detectRegion({ x: 10, y: 50 });
    expect(cmd).toBe(hand.Command.PrevPage);
  });

  it('should return NextPage if clicked on the right area', () => {
    const cmd = detectRegion({ x: 90, y: 50 });
    expect(cmd).toBe(hand.Command.NextPage);
  });

  it('should return BackUp if clicked on the bottom area', () => {
    const cmd = detectRegion({ x: 90, y: 95 });
    expect(cmd).toBe(hand.Command.Backup);
  });

  it('should return NoOp if clicked on the middle area', () => {
    const cmd = detectRegion({ x: 50, y: 50 });
    expect(cmd).toBe(hand.Command.ViewState);
  });
});
