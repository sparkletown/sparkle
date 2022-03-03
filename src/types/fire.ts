import { SigninCheckResult } from "reactfire/src/auth";
import { ObservableStatus } from "reactfire/src/useObservable";
import { QueryConstraint } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

import { DeferredAction } from "types/id";

export type RefiAuthUser = SigninCheckResult["user"];
export type RefiStatus = ObservableStatus<unknown>["status"];
export type RefiError = ObservableStatus<unknown>["error"];

export type FireAuthUser = ReturnType<typeof getAuth>["currentUser"];
export type FirePath = (string | undefined | DeferredAction)[];
export type FireConstraint =
  | QueryConstraint
  | DeferredAction
  | null
  | undefined;

export type LoadStatus = {
  isLoading: boolean;
  isLoaded: boolean;
  error?: Error | undefined;
};
