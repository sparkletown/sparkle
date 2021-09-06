import { useMemo } from "react";

import { DEFAULT_SHOW_CHAT } from "settings";

import { Settings } from "types/Firestore";
import { SparkleSelector } from "types/SparkleSelector";

import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";

export const settingsSelector: SparkleSelector<Settings | undefined> = (
  state
) => state.firestore.data.settings;

export const useSettings: () => Required<Settings> = () => {
  useFirestoreConnect([
    { collection: "settings", doc: "customizations", storeAs: "settings" },
  ]);

  const settings = useSelector(settingsSelector);

  return useMemo(
    () => ({
      showChat: settings?.showChat ?? DEFAULT_SHOW_CHAT,
    }),
    [settings]
  );
};
