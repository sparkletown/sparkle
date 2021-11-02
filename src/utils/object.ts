export type ObjectEntry = [string, unknown];

export const objectEntries: (
  object: object | null | undefined,
  options?: { parent: string; separator: string }
) => ObjectEntry[] = (object, options) => {
  const parent = options?.parent ?? "";
  const separator = options?.separator ?? ".";

  return Object.entries(object ?? {}).flatMap(([key, val]) => {
    const path = parent ? parent + separator + key : key;
    return typeof val === "object"
      ? objectEntries(val, { parent: path, separator })
      : [[path, val]];
  });
};
