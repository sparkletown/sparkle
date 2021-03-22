export type AuditoriumSection = {
  id: string;
  title?: string;
  isLocked?: boolean;
  rowsNumber?: number;
  columnsNumber?: number;
};

export enum AuditoriumSizes {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}
