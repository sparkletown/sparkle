export type Tidy<T> = T extends (infer U)[]
  ? Tidy<U>[]
  : T extends object
  ? { [K in keyof T]: Tidy<T[K]> }
  : T;
