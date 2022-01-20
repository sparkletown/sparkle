import { SigninCheckResult } from "reactfire/src/auth";
import { ObservableStatus } from "reactfire/src/useObservable";
import { getAuth } from "firebase/auth";

export type RefiAuthUser = SigninCheckResult["user"];
export type RefiStatus = ObservableStatus<unknown>["status"];
export type RefiError = ObservableStatus<unknown>["error"];

export type FireAuthUser = ReturnType<typeof getAuth>["currentUser"];
export type FirePath = (string | undefined)[];

export type LoadStatus = {
  isLoading: boolean;
  isLoaded: boolean;
};

export type LoadStatusWithError = {
  isLoading: boolean;
  isLoaded: boolean;
  error: Error | undefined;
};

export type LoadStatusWithErrorMessage = {
  isLoading: boolean;
  isLoaded: boolean;
  error: string | undefined;
};
