import { Matrix } from "types/utility";

import { WithId } from "./id";

/**
 * Create a matrix reducer function for use with .reduce()
 *
 * NOTE: this will initialize acc[row] to [] only when acc[row] is undefined.
 *
 * @param selectRow TODO
 * @param selectCol TODO
 *
 * @example
 *   TODO
 */
export const makeMatrixReducer = <T>(
  selectRow: (cur: T) => number,
  selectCol: (cur: T) => number
) => (acc: Matrix<T>, cur: T): Matrix<T> => {
  const row = selectRow(cur);
  const col = selectCol(cur);

  if (acc[row] === undefined) {
    acc[row] = [];
  }

  acc[row][col] = cur;

  return acc;
};

/**
 * A reducer function to reduce items T[] to an object { [item.id]: item }
 *
 * @param obj
 * @param item
 */
export const itemsToObjectByIdReducer = <T extends object>(
  obj: Record<string, WithId<T>>,
  item: WithId<T>
) => ({
  ...obj,
  [item.id]: item,
});
