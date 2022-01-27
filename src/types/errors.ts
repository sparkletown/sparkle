import firebaseAdmin from "firebase-admin";

export interface FirebaseError extends Error {
  _baseMessage?: string;
  code?: string;
  customData?: { serverResponse?: string };
}

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

type WithResponse = { response: firebaseAdmin.HttpResponse };
type ErrorResponse = (
  errorWithResponse: unknown
) => firebaseAdmin.HttpResponse | undefined;
export const errorResponse: ErrorResponse = (errorWithResponse) => {
  const e = errorWithResponse as WithResponse;
  return e?.response ? e.response : undefined;
};

type ErrorStatus = (errorWithResponse: unknown) => number;
export const errorStatus: ErrorStatus = (errorWithResponse) =>
  errorResponse(errorWithResponse)?.status ?? 0;

export const isFirebaseError = (e?: unknown): e is FirebaseError =>
  e instanceof Error && e.name === "FirebaseError";
