export type AuditoriumSection = {
  name: string;
  id: string;
  isLocked: boolean;
  rowsNumber?: number;
  columnsNumber?: number;
};

export enum AuditoriumSizes {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}
