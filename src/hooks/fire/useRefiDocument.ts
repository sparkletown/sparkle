import { useMemo } from "react";
import { ObservableStatus, useFirestore, useFirestoreDocData } from "reactfire";
import Bugsnag from "@bugsnag/js";
import { doc } from "firebase/firestore";

import { LoadStatus } from "types/fire";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

type UseRefiDocumentResult<T extends object> = LoadStatus &
  ObservableStatus<WithId<T>>;

/**
 * @deprecated uses Reactfire and that library has bugs related to caching and users being logged out
 *
 * @see useLiveDocument hook as a replacement
 */
export const useRefiDocument = <T extends object>(
  path: string[]
): UseRefiDocumentResult<T> => {
  const firestore = useFirestore();
  const [first, ...rest] = (path ?? []).flat();

  if (!first) {
    const e = new Error(
      `Invalid path for document query: ` + (path ?? []).join("/")
    );
    Bugsnag.notify(e, (event) => {
      event.severity = "error";
      event.addMetadata("hooks/fire::useRefiDocument", {
        path,
      });
    });
    throw e;
  }

  const result = useFirestoreDocData(
    doc(firestore, first, ...rest).withConverter(withIdConverter<T>())
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
