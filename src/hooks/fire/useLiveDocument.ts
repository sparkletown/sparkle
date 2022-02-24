import { useEffect, useMemo, useState } from "react";
import {
  doc,
  DocumentSnapshot,
  FirestoreError,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { isEqual } from "lodash";

import { FirePath } from "types/fire";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

const isValidSegment = (segment: string | undefined): segment is string =>
  "string" === typeof segment && "" !== segment;

export const useLiveDocument = <T extends object>(path: FirePath) => {
  const [data, setData] = useState<WithId<T>>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  const firestore = getFirestore();

  const [first, ...rest] = path.filter(isValidSegment);

  useEffect(() => {
    // prevents warning: Can't perform a React state update on an unmounted component.
    let isMounted = true;

    // Firestore API requires at least two good segments for it to work
    if (!rest?.length) return;

    const reference = doc(firestore, first, ...rest).withConverter(
      withIdConverter<T>()
    );

    const onNext = (doc: DocumentSnapshot<WithId<T>>) => {
      if (!isMounted) return;
      // setData(doc.data());
      setData((oldData) => {
        // this check prevents endless re-renders
        const maybeNewData = doc.data();
        return isEqual(oldData, maybeNewData) ? oldData : maybeNewData;
      });
      setIsLoading(false);
    };

    const onError = (err: FirestoreError) => {
      if (!isMounted) return;
      setError(err);
      setIsLoading(false);
    };

    const unsubscribe = onSnapshot(reference, onNext, onError);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [firestore, first, rest, setData, setError, setIsLoading]);

  return useMemo(() => ({ error, data, isLoading, isLoaded: !isLoading }), [
    error,
    isLoading,
    data,
  ]);
};
