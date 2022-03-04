import { NotifiableError } from "@bugsnag/js";
import { HttpResponse } from "firebase-admin/lib/utils/api-request";

// NOTE: keep this one private as to only create subclasses for specific uses
class SparkleError extends Error {}

export class SparkleQueryError extends SparkleError {}

export class SparkleHookError extends SparkleError {}

type AssertUnreachable = (_: never) => void;
export const assertUnreachable: AssertUnreachable = () => {
  throw new Error("Didn't expect to get here");
};

type ErrorForBugsnag = (e: unknown) => NotifiableError;
export const errorForBugsnag: ErrorForBugsnag = (e) =>
  e instanceof Error ? e : String(e);

type ErrorForEmbed = (e: unknown) => Error;
export const errorForEmbed: ErrorForEmbed = (e) =>
  e instanceof Error ? e : new Error(String(e ?? ""));

type ErrorMessage = (e: unknown) => string;
export const errorMessage: ErrorMessage = (e) =>
  e instanceof Error ? e.message : String(e);

type ErrorType = (e: unknown) => string | undefined;
export const errorType: ErrorType = (errorWithType) => {
  const e = errorWithType as Error | undefined;
  return e?.name ? String(e.name) : undefined;
};

type WithCode = { code: string };
type ErrorCode = (errorWithCode: unknown) => string;
export const errorCode: ErrorCode = (errorWithCode) => {
  const e = errorWithCode as WithCode;
  return e?.code ? String(e.code) : String(errorWithCode);
};

type WithResponse = { response: HttpResponse };
type ErrorResponse = (errorWithResponse: unknown) => HttpResponse | undefined;
export const errorResponse: ErrorResponse = (errorWithResponse) => {
  const e = errorWithResponse as WithResponse;
  return e?.response ? e.response : undefined;
};

type ErrorStatus = (errorWithResponse: unknown) => number;
export const errorStatus: ErrorStatus = (errorWithResponse) =>
  errorResponse(errorWithResponse)?.status ?? 0;
