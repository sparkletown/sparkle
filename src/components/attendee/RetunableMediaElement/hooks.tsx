import { useMemo } from "react";

import { COLLECTION_RETUNABLE_MEDIA_ELEMENTS } from "settings";

import { useRefiDocument } from "hooks/fire/useRefiDocument";

import {
  NotTunedSettings,
  RetunableMediaElementSettings,
  RetunableMediaSource,
} from "./types";

interface useRetunableMediaElementDataOptions {
  spaceId: string;
}

const NOT_TUNED_SETTINGS: NotTunedSettings = Object.freeze({
  sourceType: RetunableMediaSource.notTuned,
});

export const useRetunableMediaElement = ({
  spaceId,
}: useRetunableMediaElementDataOptions) => {
  const queryPath = useMemo(
    () => [COLLECTION_RETUNABLE_MEDIA_ELEMENTS, spaceId],
    [spaceId]
  );

  const {
    data: settings,
    isLoading,
  } = useRefiDocument<RetunableMediaElementSettings>(queryPath);

  if (isLoading) {
    return {
      isLoading,
      settings: NOT_TUNED_SETTINGS,
    };
  }

  if (!settings) {
    // This happens the first time a media element is loaded. Default to not
    // tuned
    return {
      isLoading,
      settings: NOT_TUNED_SETTINGS,
    };
  }

  return { isLoading: false, settings };
};
