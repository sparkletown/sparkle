// eslint-disable-next-line no-restricted-imports
import mixpanel, { Dict, RequestOptions, Callback } from "mixpanel-browser";
import { useMemo } from "react";

// https://stackoverflow.com/questions/32203420/check-if-mixpanel-library-has-been-loaded
const isLoaded = () => mixpanel.hasOwnProperty("get_distinct_id");

const noopTrack: typeof mixpanel.track = () => {};

/**
 * Returns an object to allow us to expose more of Mixpanel's API in future.
 *
 * NOTE: Extra level of function indirection ensures `isLoaded` is evaluated not just the first time.
 */
export const useMixpanel = () =>
  useMemo(
    () => ({
      track: (
        event_name: string,
        properties?: Dict,
        optionsOrCallback?: RequestOptions | Callback,
        callback?: Callback
      ) => {
        const track = isLoaded() ? mixpanel.track.bind(mixpanel) : noopTrack;
        return track(event_name, properties, optionsOrCallback, callback);
      },
    }),
    []
  );
