import { CallableContext } from "firebase-functions/lib/common/providers/https";

export type HttpsFunctionHandler<T> = (
  data: T,
  context: CallableContext
) => unknown | Promise<unknown>;
