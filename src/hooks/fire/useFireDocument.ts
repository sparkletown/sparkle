import { useMemo } from "react";
import { useAsync } from "react-use";
import { useFirestore } from "reactfire";
import { doc, getDoc } from "firebase/firestore";

import { FirePath } from "types/fire";

import { withIdConverter } from "utils/converters";

export const useFireDocument = <T extends object>(path: FirePath) => {
  const firestore = useFirestore();

  const { error, loading, value } = useAsync(async () => {
    if (!path?.length || path.some((segment) => !segment)) return;
    // the check above weeds out falsy values, but isn't a type guard, so TS complains
    const [first, ...rest] = path as string[];
    return (
      await getDoc(
        doc(firestore, first, ...rest).withConverter(withIdConverter<T>())
      )
    )?.data();
  }, [firestore, path]);

  return useMemo(() => {
    return {
      error,
      data: value,
      isLoading: loading,
      isLoaded: !loading,
    };
  }, [error, loading, value]);
};
