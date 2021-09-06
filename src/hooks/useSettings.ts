import { useMemo } from "react";

import { DEFAULT_SHOW_CHAT } from "settings";

import { Settings } from "types/Firestore";
import { SparkleSelector } from "types/SparkleSelector";

import { isLoaded, useFirestoreConnect } from "hooks/useFirestoreConnect";
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

  return useMemo(
    () => ({
      isLoaded: isLoaded(settings),
      settings: {
        showChat: settings?.showChat ?? DEFAULT_SHOW_CHAT,
      },
    }),
    [settings]
  );
};
