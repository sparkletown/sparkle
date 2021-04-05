export type GridPosition = {
  row: number;
  column: number;
};

export type SectionGridData = GridPosition & {
  sectionId: string;
};

export type AnyGridData = GridPosition | SectionGridData;
