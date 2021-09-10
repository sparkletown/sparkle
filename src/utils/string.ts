export const uppercaseFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.substring(1);
};

export const wrapIntoSlashes = (str: string): string => {
  return `/${str}/`;
};
