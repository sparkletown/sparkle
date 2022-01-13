import { useMemo } from "react";
import { ObservableStatus, useFirestore, useFirestoreDocData } from "reactfire";
import Bugsnag from "@bugsnag/js";
import { doc } from "firebase/firestore";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

type UseRefiDocumentResult<T extends object> = ObservableStatus<WithId<T>> & {
  isLoading: boolean;
};

export const useRefiDocument = <T extends object>(
  ...path: string[]
): UseRefiDocumentResult<T> => {
  const firestore = useFirestore();
  const [first, ...rest] = path ?? [];

  if (!first) {
    const e = new Error(
      `Invalid path for document query: ` + (path ?? []).join("/")
    );
    Bugsnag.notify(e, (event) => {
      event.severity = "error";
      event.addMetadata("hooks/reactfire::useRefiDocument", {
        path,
      });
    });
    throw e;
  }

  const result = useFirestoreDocData(
    doc(firestore, first, ...rest).withConverter(withIdConverter<T>())
  );

  return useMemo(
    () => ({
      ...result,
      isLoading: result.status === "loading",
    }),
    [result, result.status]
  );
};
