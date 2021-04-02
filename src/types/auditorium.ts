export type AuditoriumSection = {
  title?: string;
  isLocked?: boolean;
  rowsCount?: number;
  columnsCount?: number;
};

export enum AuditoriumSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}
