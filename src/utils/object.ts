export type ObjectEntry = [string, unknown];

/** @deprecated Lodash already has isPlainObject that can be reused  */
const isPlainObject: (object: unknown) => boolean = (object) => {
  const isObject = object !== null && typeof object == "object";

  if (!isObject) {
    return false;
  }

  const proto = Object.getPrototypeOf(object);
  return proto === Object.prototype || proto === null;
};

export const objectEntries: (
  object: object | null | undefined,
  options?: { parent: string; separator: string }
) => ObjectEntry[] = (object, options) => {
  const parent = options?.parent ?? "";
  const separator = options?.separator ?? ".";

  return Object.entries(object ?? {}).flatMap(([key, val]) => {
    const path = parent ? parent + separator + key : key;
    return isPlainObject(val)
      ? objectEntries(val, { parent: path, separator })
      : [[path, val]];
  });
};
