import { QueryConstraint } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

import { DeferredAction } from "types/id";

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
