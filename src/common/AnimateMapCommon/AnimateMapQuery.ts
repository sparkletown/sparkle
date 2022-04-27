import { DEFERRED } from "./settings";

import { AnimateMapQueryError } from "./AnimateMapErrors";
import { AnimateMapFirePath } from "./AnimateMapFirePath";
import { DeferredAction } from "./AnimateMapIds";

export const isDeferred = (value: unknown): value is DeferredAction =>
  value === DEFERRED;

export const isGoodSegment = (
  segment: string | DeferredAction | undefined
): segment is string => "string" === typeof segment && "" !== segment;

export const isNotValidSegment = (
  segment: string | DeferredAction | undefined
): segment is string => "string" !== typeof segment || "" === segment;

type CreatePathError = (path: AnimateMapFirePath) => AnimateMapQueryError;
export const createPathError: CreatePathError = (path) =>
  new AnimateMapQueryError({
    message: `Invalid query path: ${path.map(String).join("/")}`,
    where: "createPathError",
  });
