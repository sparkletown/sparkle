import { v4 as uuid } from "uuid";

import { DEFAULT_TABLE_COLUMNS, DEFAULT_TABLE_ROWS } from "settings";

import { Table } from "types/Table";

const generateUniqueTableReference = (title: string) => `${title}-${uuid()}`;

export const generateTable: (props: {
  tableNumber: number;
  columns?: number;
  rows?: number;
  generateTableReference?: (title: string) => string;
}) => Table = ({
  tableNumber,
  columns = DEFAULT_TABLE_COLUMNS,
  rows = DEFAULT_TABLE_ROWS,
  generateTableReference = generateUniqueTableReference,
}) => {
  const title = `Table ${tableNumber}`;
  const reference = generateTableReference(title);

  const capacity = columns * rows;

  return {
    title,
    capacity,
    reference,
    rows,
    columns,
  };
};

/**
 * Generate an array of Table configs that can be used with Jazz Bar/similar.
 *
 * @param num number of tables to create
 * @param rows how many rows will the seats be displayed across for each table
 * @param columns how many columns will the seats be displayed across for each table
 * @param startFrom what number should we start from when generating table numbers in the title
 */
export const generateTables: (props: {
  num: number;
  rows?: number;
  columns?: number;
  startFrom?: number;
  generateTableReference?: (title: string) => string;
}) => Table[] = ({
  num,
  rows,
  columns,
  generateTableReference = generateUniqueTableReference,
  startFrom = 1,
}) =>
  Array.from(Array(num)).map((_, idx) => {
    const tableNumber = startFrom + idx;

    return generateTable({
      tableNumber,
      columns,
      rows,
      generateTableReference,
    });
  });
