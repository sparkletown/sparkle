export interface GetPositionHashProps {
  row: number;
  column: number;
}

export const getPositionHash = ({ row, column }: GetPositionHashProps) => {
  return `${row}|${column}`;
};
