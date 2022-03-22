import { trim } from "lodash";

export const uppercaseFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.substring(1);
};

export const wrapIntoSlashes = (str: string): string => {
  return `/${str}/`;
};

export const isBlank = (str: string): boolean => {
  return !trim(str);
};

export const generateId: (prefix: string, tailLength?: number) => string = (
  prefix,
  tailLength = 6
) => `${prefix}-${Date.now()}-${Math.trunc(Math.random() * 10 ** tailLength)}`;

/**
 * Function that pluralizes a string.
 * @param word The string you want to pluralize.
 * @param array The array that the word is dependent on.
 * @returns The provided string in either singular or plural state.
 */
export const pluralize = <T>(word: string, array: Array<T> | undefined) => {
  const arrayExists = !!array?.length;
  const hasMultipleResults = arrayExists ? array?.length > 1 : undefined;
  const hasNoResults = arrayExists ? array?.length === 0 : undefined;
  return hasNoResults || hasMultipleResults ? word + "s" : word;
};
