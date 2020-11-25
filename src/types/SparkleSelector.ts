import { RootState } from "index";

export type SparkleSelector<T> = (state: RootState) => T;
