export interface GridPosition {
  row: number;
  column: number;
}

export interface SectionGridData extends GridPosition {
  sectionId: string;
}

export type AnyGridData = GridPosition | SectionGridData;
