import { useMemo } from "react";
import {
  ObservableStatus,
  useFirestore,
  useFirestoreCollectionData,
} from "reactfire";
import Bugsnag from "@bugsnag/js";
import { QueryConstraint } from "@firebase/firestore";
import { collection, query } from "firebase/firestore";

import { LoadStatus } from "types/fire";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

type UseRefiCollectionOptions =
  | string[]
  | {
      path: string[];
      constraints?: QueryConstraint[];
    };

export type UseRefiCollectionResult<T extends object> = LoadStatus &
  ObservableStatus<WithId<T>[]>;

export const useRefiCollection = <T extends object>(
  options: UseRefiCollectionOptions
): UseRefiCollectionResult<T> => {
  const firestore = useFirestore();

  const path = (Array.isArray(options) ? options : options?.path) ?? [];
  const constraints =
    (Array.isArray(options) ? [] : options?.constraints) ?? [];
  const [first, ...rest] = path;

  if (!first) {
    const e = new Error(`Invalid path for collection query: ` + path.join("/"));
    Bugsnag.notify(e, (event) => {
      event.severity = "error";
      event.addMetadata("hooks/fire::useRefiCollection", {
        path,
        constraints,
      });
    });
    throw e;
  }

  const result = useFirestoreCollectionData(
    query(collection(firestore, first, ...rest), ...constraints).withConverter(
      withIdConverter<T>()
    )
  );

  return useMemo(() => {
    const isLoading = result.status === "loading";
    return {
      ...result,
      isLoading,
      isLoaded: !isLoading,
    };
  }, [result]);
};
