import { useMemo } from "react";

import { COLLECTION_RETUNABLE_MEDIA_ELEMENTS } from "settings";

import { LoadStatus } from "types/fire";

import { useLiveDocument } from "hooks/fire/useLiveDocument";

import {
  NotTunedSettings,
  RetunableMediaElementSettings,
  RetunableMediaSource,
} from "./types";

type UseRetunableMediaElement = (options: {
  spaceId: string;
}) => { settings: RetunableMediaElementSettings } & LoadStatus;

const NOT_TUNED_SETTINGS: NotTunedSettings = Object.freeze({
  sourceType: RetunableMediaSource.notTuned,
});

export const useRetunableMediaElement: UseRetunableMediaElement = ({
  spaceId,
}) => {
  const queryPath = useMemo(
    () => [COLLECTION_RETUNABLE_MEDIA_ELEMENTS, spaceId],
    [spaceId]
  );

  const {
    data: settings,
    isLoading,
  } = useLiveDocument<RetunableMediaElementSettings>(queryPath);

  return useMemo(() => {
    if (isLoading) {
      return {
        isLoading,
        isLoaded: !isLoading,
        settings: NOT_TUNED_SETTINGS,
      };
    }

    if (!settings) {
      // This happens when a media element has never been tuned.
      // Default to not tuned
      return {
        isLoading,
        isLoaded: !isLoading,
        settings: NOT_TUNED_SETTINGS,
      };
    }

    return { isLoading: false, isLoaded: true, settings };
  }, [isLoading, settings]);
};
