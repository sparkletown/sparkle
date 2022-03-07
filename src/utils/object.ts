export type ObjectEntry = [string, unknown];

export const isPlainObject: (object: unknown) => boolean = (object) => {
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

export const isShallowEqual = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object1: Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object2: Record<string, any>
) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }
  return true;
};
