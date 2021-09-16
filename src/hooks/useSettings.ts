import { useMemo } from "react";

import {
  DEFAULT_SETTING_ADMIN_V1,
  DEFAULT_SETTING_ADMIN_V3,
  DEFAULT_SETTING_SHOW_CHAT,
} from "settings";

import { Settings } from "types/settings";

import { settingsSelector } from "utils/selectors";

import { isLoaded, useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";

export interface UseSetingsReturnType {
  isLoaded: boolean;
  settings: Required<Settings>;
}

export const useSettings: () => UseSetingsReturnType = () => {
  useFirestoreConnect([
    { collection: "settings", doc: "customizations", storeAs: "settings" },
  ]);

  const settings = useSelector(settingsSelector);

  return useMemo(() => {
    const {
      showChat = DEFAULT_SETTING_SHOW_CHAT,
      adminV1 = DEFAULT_SETTING_ADMIN_V1,
      adminV3 = DEFAULT_SETTING_ADMIN_V3,
    } = settings ?? {};

    return {
      isLoaded: isLoaded(settings),
      settings: {
        showChat,
        adminV1,
        adminV3,
      },
    };
  }, [settings]);
};
