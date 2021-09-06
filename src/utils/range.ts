/**
 * Generates an array [0..length).
 *
 * @example
 *   range(5)
 *   // [0, 1, 2, 3, 4]
 *
 * @param length
 */
export const range = (length: number) => Array.from(Array(length).keys());
