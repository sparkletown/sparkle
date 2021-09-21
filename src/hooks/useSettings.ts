import { useMemo } from "react";

import {
  DEFAULT_SETTING_ADMIN_VERSION,
  DEFAULT_SETTING_ENABLE_ADMIN_V1,
  DEFAULT_SETTING_ENABLE_ADMIN_V3,
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
      enableAdmin1 = DEFAULT_SETTING_ENABLE_ADMIN_V1,
      enableAdmin3 = DEFAULT_SETTING_ENABLE_ADMIN_V3,
      adminVersion = DEFAULT_SETTING_ADMIN_VERSION,
    } = settings ?? {};

    return {
      isLoaded: isLoaded(settings),
      settings: {
        showChat,
        enableAdmin1,
        enableAdmin3,
        adminVersion,
      },
    };
  }, [settings]);
};
