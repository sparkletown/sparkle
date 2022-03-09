import { useMemo } from "react";

import {
  COLLECTION_SETTINGS,
  DEFAULT_SETTING_SHOW_CHAT,
  DEFAULT_SETTING_SHOW_REACTIONS,
} from "settings";

import { Settings } from "types/settings";

import { useLiveDocument } from "./fire/useLiveDocument";

type UseSettings = () => {
  isLoaded: boolean;
  settings: Required<Settings>;
};

export const useSettings: UseSettings = () => {
  const { data, isLoaded } = useLiveDocument<Settings>([
    COLLECTION_SETTINGS,
    "customizations",
  ]);

  const {
    showChat = DEFAULT_SETTING_SHOW_CHAT,
    showReactions = DEFAULT_SETTING_SHOW_REACTIONS,
  } = data ?? {};

  return useMemo(() => ({ isLoaded, settings: { showChat, showReactions } }), [
    isLoaded,
    showChat,
    showReactions,
  ]);
};
