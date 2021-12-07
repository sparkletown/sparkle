import { useMemo } from "react";

import {
  DEFAULT_SETTING_SHOW_CHAT,
  DEFAULT_SETTING_SHOW_REACTIONS,
} from "settings";

import { Settings } from "types/settings";

import { settingsSelector } from "utils/selectors";

import { isLoaded, useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";

export interface UseSetingsResult {
  isLoaded: boolean;
  settings: Required<Settings>;
}

export const useSettings: () => UseSetingsResult = () => {
  useFirestoreConnect([
    { collection: "settings", doc: "customizations", storeAs: "settings" },
  ]);

  const settings = useSelector(settingsSelector);

  return useMemo(() => {
    const {
      showChat = DEFAULT_SETTING_SHOW_CHAT,
      showReactions = DEFAULT_SETTING_SHOW_REACTIONS,
    } = settings ?? {};

    return {
      isLoaded: isLoaded(settings),
      settings: {
        showChat,
        showReactions,
      },
    };
  }, [settings]);
};
