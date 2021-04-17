import { Table } from "types/Table";

/**
 * Generate an array of Table configs that can be used with Jazz Bar/similar.
 *
 * @param num number of tables to create
 * @param capacity how many people can sit at each table
 * @param rows how many rows will the seats be displayed across for each table
 * @param columns how many columns will the seats be displayed across for each table
 * @param titlePrefix what should the tables be called (will have the table number appended to it)
 * @param appendTableNumber whether to append the table number to the title or not
 * @param startFrom what number should we start from when generating table numbers in the title
 */
export const generateTables: (props: {
  num: number;
  capacity: number;
  rows?: number;
  columns?: number;
  titlePrefix?: string;
  appendTableNumber?: boolean;
  startFrom?: number;
}) => Table[] = ({
  num,
  capacity,
  rows = 2,
  columns = 3,
  titlePrefix = "Table",
  appendTableNumber = true,
  startFrom = 1,
}) =>
  Array.from(Array(num)).map((_, idx) => {
    const tableNumber = startFrom + idx;

    const title = appendTableNumber
      ? `${titlePrefix} ${tableNumber}`
      : titlePrefix;

    return {
      title,
      reference: title,
      capacity,
      rows,
      columns,
    };
  });
