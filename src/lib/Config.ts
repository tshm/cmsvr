/** percent notation */
export type Percent = number;

export interface UIConfig {
	topAreaHeightPercent: Percent;
	bottomAreaHeightPercent: Percent;
	middleWidthPercent: Percent;
}

export type ViewMode = 'verticalFit' | 'horizontalFit' | 'None';
