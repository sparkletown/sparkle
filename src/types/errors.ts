export interface FirebaseError extends Error {
  _baseMessage?: string;
  code?: string;
  customData?: { serverResponse?: string };
}

export const isFirebaseError = (e?: unknown): e is FirebaseError =>
  e instanceof Error && e.name === "FirebaseError";
