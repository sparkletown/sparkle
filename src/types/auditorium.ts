export type AuditoriumSection = {
  rowsCount?: number;
  columnsCount?: number;
  capacity?: number;
  isVip?: boolean;
};

export enum AuditoriumSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}
