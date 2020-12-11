// eslint-disable-next-line no-restricted-imports
import mixpanel, { Dict, RequestOptions, Callback } from "mixpanel-browser";
import { useMemo } from "react";

// https://stackoverflow.com/questions/32203420/check-if-mixpanel-library-has-been-loaded
const isLoaded = () => mixpanel.hasOwnProperty("get_distinct_id");

const noopTrack: (
  event_name: string,
  properties?: Dict,
  optionsOrCallback?: RequestOptions | Callback,
  callback?: Callback
) => void = () => {};

export const useMixpanel = () => {
  const mixpanelMemo = useMemo(
    () => ({
      track: isLoaded() ? mixpanel.track.bind(mixpanel) : noopTrack,
    }),
    []
  );

  return mixpanelMemo;
};
