/**
 * NOTE: The following code is modified version of Lodash's
 * sampleSize (@see https://github.com/lodash/lodash/blob/master/sampleSize.js)
 * and
 * copyArray (@see https://github.com/lodash/lodash/blob/master/.internal/copyArray.js)
 */

import { slice } from "lodash";

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source: unknown[], array?: unknown[]) {
  let index = -1;
  const length = source.length;

  array || (array = new Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Gets `n` random elements at unique keys from `array` up to the
 * size of `array`.
 *
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to sample.
 * @param options
 * @returns {Array} Returns the random elements.
 * @example
 *
 * sampleSize([1, 2, 3], 2)
 * // => [3, 1]
 *
 * sampleSize([1, 2, 3], 4)
 * // => [2, 3, 1]
 */
function sampleSize<T = unknown>(
  array: T[],
  options?: { n?: number; random?: () => number }
) {
  const random = options?.random ?? Math.random;
  const length = array == null ? 0 : array.length;
  let n = options?.n ?? length;
  if (!length || n < 1) {
    return [];
  }
  n = n > length ? length : n;
  let index = -1;
  const lastIndex = length - 1;
  const result = copyArray(array);
  while (++index < n) {
    const rand = index + Math.floor(random() * (lastIndex - index + 1));
    const value = result[rand];
    result[rand] = result[index];
    result[index] = value;
  }
  return slice(result, 0, n);
}

export default sampleSize;
