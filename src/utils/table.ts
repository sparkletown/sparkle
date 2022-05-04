import { v4 as uuid } from "uuid";

import { Table } from "types/Table";

const generateUniqueTableReference = (title: string) => `${title}-${uuid()}`;

export const generateTable: (props: {
  tableNumber: number;
  capacity?: number;
  generateTableReference?: (title: string) => string;
}) => Table = ({
  tableNumber,
  capacity,

  generateTableReference = generateUniqueTableReference,
}) => {
  const title = `Table ${tableNumber}`;
  const reference = generateTableReference(title);

  return {
    title,
    capacity,
    reference,
  };
};

/**
 * Generate an array of Table configs that can be used with Jazz Bar/similar.
 *
 * @param num number of tables to create
 * @param capacity number of seats per table
 * @param startFrom what number should we start from when generating table numbers in the title
 */
export const generateTables: (props: {
  num: number;
  capacity?: number;
  startFrom?: number;
  generateTableReference?: (title: string) => string;
}) => Table[] = ({
  num,
  capacity,
  generateTableReference = generateUniqueTableReference,
  startFrom = 1,
}) =>
  Array.from(Array(num)).map((_, idx) => {
    const tableNumber = startFrom + idx;

    return generateTable({
      tableNumber,
      capacity,
      generateTableReference,
    });
  });
