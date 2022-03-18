import { trim } from "lodash";
import { v4 as uuid } from "uuid";

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

export const generateTableReferenceId = (title: string) => `${title}-${uuid()}`;
