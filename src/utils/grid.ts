import { GridPosition } from "types/grid";

export const getPositionHash = ({ row, column }: GridPosition): string => {
  return `${row}|${column}`;
};
