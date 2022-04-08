export type Point = {
  x: number;
  y: number;
};

export type Dimensions = {
  width: number;
  height: number;
};

export type Position = {
  left: number;
  top: number;
};

// @debt remove this, components shouldn't have containerClassName prop, and
// in a rare need of injecting classes, className?: string is more close to how React deals with it
/**
 * @deprecated Do not add this to interfaces. Prefer variance props over injected classes
 * */
export type ContainerClassName = { containerClassName?: string };

// NOTE: use the following only in case of forms register type, define another like this one for other workarounds
// @debt transitionary value, remove AnyForm once all its uses are replaced by more accurate types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyForm = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFormRule = any;
