import { useCallback, useMemo } from "react";
// eslint-disable-next-line no-restricted-imports
import mixpanel, { Mixpanel } from "mixpanel-browser";

import { MIXPANEL_PROJECT_TOKEN } from "secrets";

import {
  DEFAULT_ANALYTICS_GROUP_KEY,
  DEFAULT_ANALYTICS_WORLD_NAME,
  ENTER_AUDITORIUM_SECTION_EVENT_NAME,
  ENTER_JAZZ_BAR_EVENT_NAME,
  ENTER_ROOM_EVENT_NAME,
  LOG_IN_EVENT_NAME,
  OPEN_ROOM_MODAL_EVENT_NAME,
  SELECT_TABLE_EVENT_NAME,
  SIGN_UP_EVENT_NAME,
  TAKE_SEAT_EVENT_NAME,
  VENUE_PAGE_LOADED_EVENT_NAME,
} from "settings";

import { ReactHook } from "types/utility";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useUser } from "hooks/useUser";
import { useWorldById } from "hooks/worlds/useWorldById";

const defaultWorld = {
  id: "undefined",
  name: DEFAULT_ANALYTICS_WORLD_NAME,
};

export const setAnalyticsGroup = (groupKey: string, groupName: string) => {
  if (!MIXPANEL_PROJECT_TOKEN) return;

  try {
    mixpanel.set_group(groupKey, groupName);

    const group = mixpanel.get_group(groupKey, groupName);
    group.set({ $name: groupName });
  } catch (e) {
    console.error(setAnalyticsGroup.name, e);
  }
};

export const initAnalytics = (opts?: Object) => {
  if (!MIXPANEL_PROJECT_TOKEN) {
    console.warn("Mixpanel is not set up correctly. The token is missing.");
    return;
  }

  try {
    return mixpanel.init(MIXPANEL_PROJECT_TOKEN, opts);
  } catch (e) {
    console.error(initAnalytics.name, e);
  }
};

export const identifyUser = ({ email, name = "N/A" }: IdentifyUserProps) => {
  if (!MIXPANEL_PROJECT_TOKEN) return;

  try {
    mixpanel.identify(email);
    mixpanel.people.set({
      $email: email,
      $name: `${name} (${email})`,
    });
  } catch (e) {
    console.error(identifyUser.name, e);
  }
};

export interface UseAnalyticsProps {
  venue?: WithId<AnyVenue>;
}

export interface IdentifyUserProps {
  email: string;
  name?: string;
}

export interface UseAnalyticsResult {
  initAnalytics: (opts?: Object) => Mixpanel | undefined;
  identifyUser: (props: IdentifyUserProps) => void;
  trackVenuePageLoadedEvent: () => void;
  trackLogInEvent: (email: string) => void;
  trackSignUpEvent: (email: string) => void;
  trackOpenPortalModalEvent: (roomTitle?: string) => void;
  trackEnterRoomEvent: (roomTitle?: string, roomTemplate?: string) => void;
  trackEnterAuditoriumSectionEvent: () => void;
  trackSelectTableEvent: () => void;
  trackTakeSeatEvent: () => void;
  trackEnterJazzBarEvent: () => void;
}

export const useAnalytics: ReactHook<UseAnalyticsProps, UseAnalyticsResult> = ({
  venue,
}) => {
  const { user } = useUser();
  const { world, isLoaded: isWorldLoaded } = useWorldById(venue?.worldId);

  const worldIdAndName = useMemo(() => {
    if (!isWorldLoaded || !world) return;

    return { id: world.id, name: world.name };
  }, [isWorldLoaded, world]);

  const trackWithWorld = useCallback(
    (eventName, properties = {}) => {
      if (!venue) return;

      const { id: worldId, name: worldName } = worldIdAndName ?? defaultWorld;
      const worldString = `${worldName} (${worldId})`;
      setAnalyticsGroup(DEFAULT_ANALYTICS_GROUP_KEY, worldString);

      try {
        return mixpanel.track_with_groups(
          eventName,
          { email: user?.email, venueId: venue.id, ...properties },
          {
            [DEFAULT_ANALYTICS_GROUP_KEY]: worldString,
          }
        );
      } catch (e) {
        console.error(trackWithWorld.name, e);
      }
    },
    [user, venue, worldIdAndName]
  );

  const trackLogInEvent = useCallback(
    (email: string) => trackWithWorld(LOG_IN_EVENT_NAME, { email }),
    [trackWithWorld]
  );

  const trackSignUpEvent = useCallback(
    (email: string) => {
      if (!email) return;

      return trackWithWorld(SIGN_UP_EVENT_NAME, {
        email,
      });
    },
    [trackWithWorld]
  );

  const trackVenuePageLoadedEvent = useCallback(
    () =>
      trackWithWorld(VENUE_PAGE_LOADED_EVENT_NAME, {
        template: venue?.template,
      }),
    [trackWithWorld, venue?.template]
  );

  const trackOpenPortalModalEvent = useCallback(
    (roomTitle?: string) =>
      trackWithWorld(OPEN_ROOM_MODAL_EVENT_NAME, {
        roomName: roomTitle,
      }),
    [trackWithWorld]
  );

  const trackEnterRoomEvent = useCallback(
    (roomTitle?: string, roomTemplate?: string) =>
      trackWithWorld(ENTER_ROOM_EVENT_NAME, {
        roomTitle,
        roomTemplate,
      }),
    [trackWithWorld]
  );

  const trackEnterAuditoriumSectionEvent = useCallback(
    () => trackWithWorld(ENTER_AUDITORIUM_SECTION_EVENT_NAME),
    [trackWithWorld]
  );

  const trackSelectTableEvent = useCallback(
    () =>
      trackWithWorld(SELECT_TABLE_EVENT_NAME, {
        venueTemplate: venue?.template,
      }),
    [trackWithWorld, venue?.template]
  );

  const trackTakeSeatEvent = useCallback(
    () =>
      trackWithWorld(TAKE_SEAT_EVENT_NAME, {
        venueTemplate: venue?.template,
      }),
    [trackWithWorld, venue]
  );

  const trackEnterJazzBarEvent = useCallback(
    () => trackWithWorld(ENTER_JAZZ_BAR_EVENT_NAME),
    [trackWithWorld]
  );

  return useMemo(
    () => ({
      initAnalytics,
      identifyUser,
      trackEnterAuditoriumSectionEvent,
      trackEnterJazzBarEvent,
      trackOpenPortalModalEvent,
      trackEnterRoomEvent,
      trackSelectTableEvent,
      trackLogInEvent,
      trackSignUpEvent,
      trackTakeSeatEvent,
      trackVenuePageLoadedEvent,
    }),
    [
      trackEnterAuditoriumSectionEvent,
      trackEnterJazzBarEvent,
      trackOpenPortalModalEvent,
      trackEnterRoomEvent,
      trackSelectTableEvent,
      trackLogInEvent,
      trackSignUpEvent,
      trackTakeSeatEvent,
      trackVenuePageLoadedEvent,
    ]
  );
};
