// eslint-disable-next-line no-restricted-imports
import mixpanel, { Dict, RequestOptions, Callback } from "mixpanel-browser";
import { useMemo } from "react";
import { MIXPANEL_PROJECT_TOKEN } from "secrets";

const noopTrack: (
  event_name: string,
  properties?: Dict,
  optionsOrCallback?: RequestOptions | Callback,
  callback?: Callback
) => void = () => {};

export const useMixpanel = () => {
  const mixpanelMemo = useMemo(
    () => ({
      track: MIXPANEL_PROJECT_TOKEN ? mixpanel.track.bind(mixpanel) : noopTrack,
    }),
    []
  );

  return mixpanelMemo;
};
