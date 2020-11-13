/**
 * To be used with Array Filter ([].filter()) and similar.
 *
 * @param item the item in the array being processed
 *
 * @example
 *   const somethingTrue = true
 *   const somethingFalse = false
 *
 *   const myArray = [
 *     'A',                          // 'A'
 *     somethingFalse && 'B',        // false
 *     'C',                          // 'C'
 *     somethingTrue && 'D',         // 'D'
 *     'etc',                        // 'etc'
 *   ]
 *
 *   myArray.filter(isTruthyFilter)  // ['A', 'C', 'D', 'etc']
 *
 */
export const isTruthyFilter = <T>(item?: T | false): item is T => !!item;
