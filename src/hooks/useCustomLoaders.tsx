import { useMemo } from "react";

import { customLoadersSelector } from "utils/selectors";

import { useSelector } from "./useSelector";
import { useFirestoreConnect } from "./useFirestoreConnect";

export const useCustomLoaders = () => {
  useFirestoreConnect("loaders");

  const customLoaders = useSelector(customLoadersSelector);

  return useMemo(() => customLoaders ?? [], [customLoaders]);
};
