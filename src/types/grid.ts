export interface SeatPosition {
  seatIndex: number;
}

export interface SectionPositionData extends SeatPosition {
  sectionId: string;
}

export type AnyGridData = SeatPosition | SectionPositionData;
