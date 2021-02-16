/**
 * Type helper representing all types of T except undefined
 */
export type Defined<T> = T & Exclude<T, undefined>;

export type ExtractProps<T> = T extends React.FunctionComponent<infer U>
  ? U
  : never;

export type Point = {
  x: number;
  y: number;
};

export type Dimensions = {
  width: number;
  height: number;
};

export type Bounds = Point & Dimensions;

export type Matrix<T> = T[][];

export type ReactHook<T, U> = (props: T) => U;
