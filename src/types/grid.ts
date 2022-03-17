export interface SeatPosition {
  seatIndex: number;
}

export interface SectionGridData extends SeatPosition {
  sectionId: string;
}

export type AnyGridData = SeatPosition | SectionGridData;
