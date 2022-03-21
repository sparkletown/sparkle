import { QueryConstraint } from "@firebase/firestore";
import { QueryDocumentSnapshot } from "firebase/firestore";

import { ALWAYS_EMPTY_ARRAY, DEFERRED } from "settings";

import { FireConstraint, FirePath } from "types/fire";
import { DeferredAction } from "types/id";

import { withId } from "utils/id";

import { SparkleQueryError } from "./error";

type CreatePathError = (path: FirePath) => SparkleQueryError;
export const createPathError: CreatePathError = (path) =>
  new SparkleQueryError({
    message: `Invalid query path: ${path.map(String).join("/")}`,
    where: "createPathError",
  });

type CreateConstraintsError = (
  constraints?: FireConstraint[]
) => SparkleQueryError;
export const createConstraintsError: CreateConstraintsError = (constraints) =>
  new SparkleQueryError({
    message: `Invalid query constraints: ${
      constraints ? constraints.map(String).join(" AND ") : constraints
    }`,
    where: "createConstraintsError",
  });

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

export type CollectionQueryOptions =
  | DeferredAction
  | (string | DeferredAction)[]
  | {
      path: (string | DeferredAction)[] | DeferredAction;
      constraints?: FireConstraint[] | DeferredAction;
    };

type OptionsToPath = (options: CollectionQueryOptions) => string[];

const optionsToPath: OptionsToPath = (options): string[] => {
  if (isDeferred(options)) return ALWAYS_EMPTY_ARRAY;

  if (Array.isArray(options)) {
    // TS still thinks options can have deferred even after .some(isDeferred)
    return options.some(isDeferred)
      ? ALWAYS_EMPTY_ARRAY
      : (options as string[]);
  }

  if (isDeferred(options.path)) return ALWAYS_EMPTY_ARRAY;
  if (options.path?.some(isDeferred)) return ALWAYS_EMPTY_ARRAY;

  // TS still thinks options.path can have deferred even after .some(isDeferred)
  return (options.path as string[]) ?? ALWAYS_EMPTY_ARRAY;
};

type OptionsToConstraints = (
  options: CollectionQueryOptions
) => FireConstraint[];
const optionsToConstraints: OptionsToConstraints = (options) => {
  if (Array.isArray(options)) return ALWAYS_EMPTY_ARRAY;
  if (isDeferred(options)) return ALWAYS_EMPTY_ARRAY;
  if (isDeferred(options.constraints)) return ALWAYS_EMPTY_ARRAY;
  return options.constraints ?? ALWAYS_EMPTY_ARRAY;
};

type CheckDeferred = (options: CollectionQueryOptions) => boolean | undefined;

const checkDeferred: CheckDeferred = (options) => {
  if (isDeferred(options)) return true;
  if (Array.isArray(options)) return options?.some(isDeferred);

  const path = options.path;
  const constraints = options.constraints;
  if (isDeferred(path)) return true;
  if (isDeferred(constraints)) return true;

  return path?.some(isDeferred) || constraints?.some(isDeferred);
};

export const parseCollectionQueryOptions = (
  options: CollectionQueryOptions
) => {
  const hasDeferred = checkDeferred(options);
  const path = optionsToPath(options);
  const constraints = optionsToConstraints(options);

  const filteredPath = path.filter(isGoodSegment);
  const filteredConstraints = constraints.filter(isGoodConstraint);

  // Some quality of life and input sanity checks follow, like
  // Firestore API requires at least two defined arguments for it to not throw an error

  const [first, ...rest] = filteredPath;
  const shortPath = !rest?.length;
  const incompletePath = !first;
  const noConstraints = !filteredConstraints.length;
  const invalidPath = path?.some(isNotValidSegment);
  const invalidConstraints = constraints?.some(isNotValidConstraint);

  const hasPathError = incompletePath || invalidPath;
  const hasConstraintsError =
    (shortPath && noConstraints) || invalidConstraints;

  return {
    hasDeferred,
    path,
    first,
    rest,
    hasPathError,
    hasConstraintsError,
    constraints,
    filteredConstraints,
  };
};
