import { Matrix } from "types/utility";

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
