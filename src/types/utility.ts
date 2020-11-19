export type ExtractProps<T> = T extends React.FunctionComponent<infer U>
  ? U
  : never;

export type Dimensions = {
  width: number;
  height: number;
};

export type Matrix<T> = T[][];

export type ReactHook<T, U> = (props: T) => U;
