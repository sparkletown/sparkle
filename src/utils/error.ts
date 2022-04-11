import { NotifiableError } from "@bugsnag/js";
import { HttpResponse } from "firebase-admin/lib/utils/api-request";

type SparkleErrorOptions = {
  message?: string;
  where?: string;
  args?: unknown;
  cause?: Error | string;
  causeInMessage?: "ignore" | "append" | "replace";
};

type GenerateMessage = (options: {
  causeInMessage: "ignore" | "append" | "replace";
  message: string | undefined;
  cause: Error | string | undefined;
}) => string;

const generateMessage: GenerateMessage = ({
  message,
  causeInMessage,
  cause,
}) => {
  if (!cause || causeInMessage === "ignore") {
    return message ?? "";
  }

  if (!message || causeInMessage === "replace") {
    return String(cause);
  }

  return message + ". Due to: " + cause;
};

// NOTE: keep this one private as to only create subclasses for specific uses
class SparkleError extends Error {
  readonly where?: string;
  readonly args?: unknown;
  readonly cause?: unknown;

  constructor(
    name?: string,
    {
      args,
      cause,
      message,
      where,
      causeInMessage = "append",
    }: SparkleErrorOptions = {}
  ) {
    super(generateMessage({ causeInMessage, message, cause }));
    this.name = name || "SparkleError";
    this.where = where;
    this.args = args;
    this.cause = cause;
  }
}

export class SparkleQueryError extends SparkleError {
  constructor(options?: SparkleErrorOptions) {
    super("SparkleQueryError", options);
  }
}

export class SparkleHookError extends SparkleError {
  constructor(options?: SparkleErrorOptions) {
    super("SparkleHookError", options);
  }
}

export class SparkleFetchError extends SparkleError {
  constructor(options?: SparkleErrorOptions) {
    super("SparkleFetchError", options);
  }
}

export class SparkleAssertError extends SparkleError {
  constructor(options?: SparkleErrorOptions) {
    const args = options?.args;
    super(
      "SparkleAssertError" + (args ? " (" + JSON.stringify(args) + ")" : ""),
      options
    );
  }
}

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

type CaptureError = <T = unknown>(error: T) => T;
/**
 * A convenience function to capture errors or promise rejections
 */
export const captureError: CaptureError = (error) => {
  // TODO: add more logic here, distinguish errors by type and extra info in them, write to Bugsnag etc.
  // NOTE: at least write the error to the console so it is "captured" and not ignored
  console.warn("Captured", error);

  // just helps with chain-ability, if needed by promises or other function compositions
  return error;
};

type CreateErrorCapture = (
  options: SparkleErrorOptions
) => (error: unknown) => Error;
/**
 * A convenience function to generate error capture function for promise rejections that need extra info
 */
export const createErrorCapture: CreateErrorCapture = (
  options: SparkleErrorOptions
) => (error: unknown) =>
  error instanceof Error
    ? captureError(error)
    : captureError(new SparkleError("", options));

type CreateErrorRethrow = <T>(
  options: SparkleErrorOptions
) => (error: unknown) => T;
/**
 * A convenience function to generate error capture function for promise rejections that need extra info
 *
 * Works like @see createErrorCapture but uses throw instead of return
 *
 * NOTE: the return type should be void, but T is used so that TS can allow constructs like
 *   await someAsyncFunction().catch(createErrorRethrow())
 * that just re-packages the rejection and doesn't touch the result
 */
export const createErrorRethrow: CreateErrorRethrow = (
  options: SparkleErrorOptions
) => (error: unknown) => {
  options ??= {};

  const cause = error instanceof Error ? error : String(error);

  const sparkleError = captureError(
    new SparkleError("", { ...options, cause })
  );

  throw sparkleError;
};
