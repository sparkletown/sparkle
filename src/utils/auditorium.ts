export interface GetPositionHashProps {
  row: number;
  column: number;
}

export const getPositionHash = ({ row, column }: GetPositionHashProps) => {
  return `${row}|${column}`;
};

export interface TranslateIndexProps {
  index: number;
  totalAmount: number;
}

export const translateIndex = ({ index, totalAmount }: TranslateIndexProps) =>
  index - Math.floor(totalAmount / 2);
