import { LoadStatus } from "types/fire";

export type ImageCheck = LoadStatus & {
  isValid: boolean;
  width: number | undefined;
  height: number | undefined;
};
