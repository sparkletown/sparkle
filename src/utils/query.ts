import { QueryConstraint } from "@firebase/firestore";
import { QueryDocumentSnapshot } from "firebase/firestore";

import { DEFERRED } from "settings";

import { FirePath } from "types/fire";
import { DeferredAction } from "types/id";

import { withId } from "utils/id";

class SparkleQueryError extends Error {}

type CreatePathError = (path: FirePath) => SparkleQueryError;
export const createPathError: CreatePathError = (path) =>
  new SparkleQueryError(`Invalid query path: ${path.map(String).join("/")}`);

type CreateConstraintsError = (
  constraints?: (QueryConstraint | DeferredAction | null | undefined)[]
) => SparkleQueryError;
export const createConstraintsError: CreateConstraintsError = (constraints) =>
  new SparkleQueryError(
    `Invalid query constraints: ${
      constraints ? constraints.map(String).join(" AND ") : constraints
    }`
  );

export const dataWithId = <T extends object>(d: QueryDocumentSnapshot<T>) =>
  withId(d.data(), d.id);

export const isDeferred = (value: unknown): value is DeferredAction =>
  value === DEFERRED;

export const isGoodSegment = (
  segment: string | DeferredAction | undefined
): segment is string => "string" === typeof segment && "" !== segment;

export const isNotValidSegment = (
  segment: string | DeferredAction | undefined
): segment is string => "string" !== typeof segment || "" === segment;

export const isGoodConstraint = (
  constraint: QueryConstraint | DeferredAction | null | undefined
): constraint is QueryConstraint =>
  constraint !== null && constraint !== undefined && constraint !== DEFERRED;

export const isNotValidConstraint = (
  constraint: QueryConstraint | DeferredAction | null | undefined
): constraint is QueryConstraint =>
  constraint === null || constraint === undefined;
