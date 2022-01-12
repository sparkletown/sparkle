import { SigninCheckResult } from "reactfire/src/auth";
import { ObservableStatus } from "reactfire/src/useObservable";

export type RefiAuthUser = SigninCheckResult["user"];
export type RefiStatus = ObservableStatus<unknown>["status"];
export type RefiError = ObservableStatus<unknown>["error"];
