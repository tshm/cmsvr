/** percent notation */
export type Percent = number;

export type PagingConfig = {
  topAreaHeightPercent: Percent;
  bottomAreaHeightPercent: Percent;
  middleWidthPercent: Percent;
};

export type ViewMode = 'verticalFit' | 'horizontalFit' | 'None';

export interface Config {
  pagingConfig: PagingConfig;
  defaultViewMode: ViewMode;
}
