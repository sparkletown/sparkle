import { useEffect, useMemo, useState } from "react";

import { DEFAULT_SHOW_CHAT } from "settings";

import { Settings } from "types/Firestore";
import { SparkleSelector } from "types/SparkleSelector";

import { isTruthy } from "utils/types";

import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";

export const settingsSelector: SparkleSelector<Settings | undefined> = (
  state
) => state.firestore.data.settings;

export interface UseSetingsReturnType {
  isLoaded: boolean;
  settings: Required<Settings>;
}

export const useSettings: () => UseSetingsReturnType = () => {
  useFirestoreConnect([
    { collection: "settings", doc: "customizations", storeAs: "settings" },
  ]);

  const settings = useSelector(settingsSelector);
  const [isLoaded, setIsLoaded] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (isLoaded === undefined) {
      setIsLoaded(false);
    } else {
      setIsLoaded(true);
    }
    // disabling because we should be dependent only on settings here
  }, [settings]); // eslint-disable-line react-hooks/exhaustive-deps

  return useMemo(
    () => ({
      isLoaded: isTruthy(isLoaded),
      settings: {
        showChat: settings?.showChat ?? DEFAULT_SHOW_CHAT,
      },
    }),
    [settings, isLoaded]
  );
};
