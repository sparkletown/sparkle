export type AuditoriumSection = {
  isLocked?: boolean;
  rowsCount?: number;
  columnsCount?: number;
  capacity?: number;
};

export enum AuditoriumSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}
