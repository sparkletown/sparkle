import { useCallback, useMemo } from "react";
import mixpanel, { Mixpanel } from "mixpanel-browser";

import { MIXPANEL_PROJECT_TOKEN } from "secrets";

import {
  DEFAULT_ANALYTICS_GROUP_KEY,
  DEFAULT_ANALYTICS_WORLD_NAME,
  ENTER_AUDITORIUM_EVENT_NAME,
  ENTER_JAZZ_BAR_EVENT_NAME,
  ENTER_ROOM_EVENT_NAME,
  LOG_IN_EVENT_NAME,
  OPEN_ROOM_MODAL_EVENT_NAME,
  SELECT_TABLE_EVENT_NAME,
  SIGN_UP_EVENT_NAME,
  TAKE_SEAT_EVENT_NAME,
  VENUE_PAGE_LOADED_EVENT_NAME,
} from "settings";

import { World } from "api/admin";

import { ReactHook } from "types/utility";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useCurrentWorld } from "hooks/useCurrentWorld";
import { useUser } from "hooks/useUser";

const setAnalyticsGroup = (groupKey: string, groupId: string) => {
  mixpanel.set_group(groupKey, groupId);
  mixpanel.get_group(groupKey, groupId).set({ $name: groupId });
};

const trackDefaultGroupAnalyticsEvent = (
  eventName: string,
  properties: Object,
  worldName: string = DEFAULT_ANALYTICS_WORLD_NAME
) => {
  return mixpanel.track_with_groups(eventName, properties, {
    [DEFAULT_ANALYTICS_GROUP_KEY]: worldName,
  });
};

interface UseAnalyticsProps {
  venue?: WithId<AnyVenue>;
}

interface UseAnalyticsResult {
  initAnalytics: (opts?: Object) => Mixpanel | undefined;
  identifyUser: (email: string, name?: string) => void;
  trackVenuePageLoadedEvent: (
    worldName: WithId<World>,
    groupKey?: string
  ) => void;
  trackLogInEvent: (email: string) => void;
  trackSignUpEvent: (email: string) => void;
  trackOpenRoomModalEvent: (roomTitle?: string, groupKey?: string) => void;
  trackEnterRoomEvent: (roomTemplate?: string, groupKey?: string) => void;
  trackEnterAuditoriumEvent: (groupKey?: string) => void;
  trackSelectTableEvent: (groupKey?: string) => void;
  trackTakeSeatEvent: (groupKey?: string) => void;
  trackEnterJazzBarEvent: (groupKey?: string) => void;
}

export const useAnalytics: ReactHook<UseAnalyticsProps, UseAnalyticsResult> = ({
  venue,
}) => {
  const { user } = useUser();
  const { world, isLoaded: isWorldLoaded } = useCurrentWorld({
    worldId: venue?.worldId,
  });

  const worldIdAndName = useMemo(() => {
    if (!isWorldLoaded || !world) return;

    return { id: world.id, name: world.name || DEFAULT_ANALYTICS_WORLD_NAME };
  }, [isWorldLoaded, world]);

  const initAnalytics = useCallback((opts?: Object) => {
    if (!MIXPANEL_PROJECT_TOKEN) {
      console.warn("Mixpanel is not set up correctly.");
      return;
    }

    return mixpanel.init(MIXPANEL_PROJECT_TOKEN, opts);
  }, []);

  const identifyUser = useCallback((email: string, name = "N/A") => {
    if (!MIXPANEL_PROJECT_TOKEN) return;

    mixpanel.identify(email);
    mixpanel.people.set({
      $email: email,
      $name: `${name} (${email})`,
    });
  }, []);

  const trackLogInEvent = useCallback(
    (email: string) => {
      if (!MIXPANEL_PROJECT_TOKEN || !email || !venue) return;

      setAnalyticsGroup(
        DEFAULT_ANALYTICS_GROUP_KEY,
        DEFAULT_ANALYTICS_WORLD_NAME
      );

      return trackDefaultGroupAnalyticsEvent(LOG_IN_EVENT_NAME, {
        email,
        venueId: venue.id,
      });
    },
    [venue]
  );

  const trackSignUpEvent = useCallback((email: string) => {
    if (!MIXPANEL_PROJECT_TOKEN || !email) return;

    setAnalyticsGroup(
      DEFAULT_ANALYTICS_GROUP_KEY,
      DEFAULT_ANALYTICS_WORLD_NAME
    );

    return trackDefaultGroupAnalyticsEvent(
      SIGN_UP_EVENT_NAME,
      { email },
      DEFAULT_ANALYTICS_WORLD_NAME
    );
  }, []);

  const trackVenuePageLoadedEvent = useCallback(
    (world: WithId<World>, groupKey: string = DEFAULT_ANALYTICS_GROUP_KEY) => {
      if (!MIXPANEL_PROJECT_TOKEN || !venue || !world || !user) return;
      const groupId =
        world.name !== world.id ? `${world.name} (${world.id})` : world.name;

      setAnalyticsGroup(groupKey, groupId);

      return trackDefaultGroupAnalyticsEvent(
        VENUE_PAGE_LOADED_EVENT_NAME,
        { worldId: world.id, worldName: world.name, template: venue.template },
        groupId
      );
    },
    [user, venue]
  );

  const trackOpenRoomModalEvent = useCallback(
    (roomTitle?: string, groupKey: string = DEFAULT_ANALYTICS_GROUP_KEY) => {
      if (
        !MIXPANEL_PROJECT_TOKEN ||
        !user ||
        !venue ||
        !worldIdAndName ||
        !roomTitle
      )
        return;

      const { id: worldId, name: worldName } = worldIdAndName;
      const groupId = `${worldName} (${worldId})`;

      setAnalyticsGroup(groupKey, groupId);

      return trackDefaultGroupAnalyticsEvent(
        OPEN_ROOM_MODAL_EVENT_NAME,
        {
          worldId,
          worldName,
          email: user.email,
          roomName: roomTitle,
          venueId: venue.id,
        },
        groupId
      );
    },
    [user, venue, worldIdAndName]
  );

  const trackEnterRoomEvent = useCallback(
    (roomTemplate?: string, groupKey: string = DEFAULT_ANALYTICS_GROUP_KEY) => {
      if (
        !MIXPANEL_PROJECT_TOKEN ||
        !user ||
        !venue ||
        !worldIdAndName ||
        !roomTemplate
      )
        return;

      const { id: worldId, name: worldName } = worldIdAndName;
      const groupId = `${worldName} (${worldId})`;

      setAnalyticsGroup(groupKey, groupId);

      return trackDefaultGroupAnalyticsEvent(
        ENTER_ROOM_EVENT_NAME,
        {
          worldId,
          worldName,
          email: user.email,
          roomTemplate: roomTemplate,
          venueId: venue.id,
        },
        groupId
      );
    },
    [user, venue, worldIdAndName]
  );

  const trackEnterAuditoriumEvent = useCallback(
    (groupKey: string = DEFAULT_ANALYTICS_GROUP_KEY) => {
      if (!MIXPANEL_PROJECT_TOKEN || !user || !venue || !worldIdAndName) return;

      const { id: worldId, name: worldName } = worldIdAndName;
      const groupId = `${worldName} (${worldId})`;

      setAnalyticsGroup(groupKey, groupId);

      return trackDefaultGroupAnalyticsEvent(
        ENTER_AUDITORIUM_EVENT_NAME,
        { worldId, worldName, email: user.email, venueId: venue.id },
        groupId
      );
    },
    [user, venue, worldIdAndName]
  );

  const trackSelectTableEvent = useCallback(
    (groupKey: string = DEFAULT_ANALYTICS_GROUP_KEY) => {
      if (!MIXPANEL_PROJECT_TOKEN || !user || !venue || !worldIdAndName) return;

      const { id: worldId, name: worldName } = worldIdAndName;
      const groupId = `${worldName} (${worldId})`;

      setAnalyticsGroup(groupKey, groupId);

      return trackDefaultGroupAnalyticsEvent(
        SELECT_TABLE_EVENT_NAME,
        {
          worldId,
          worldName,
          email: user.email,
          venueId: venue.id,
          venueTemplate: venue.template,
        },
        groupId
      );
    },
    [user, venue, worldIdAndName]
  );

  const trackTakeSeatEvent = useCallback(
    (groupKey: string = DEFAULT_ANALYTICS_GROUP_KEY) => {
      if (!MIXPANEL_PROJECT_TOKEN || !user || !venue || !worldIdAndName) return;

      const { id: worldId, name: worldName } = worldIdAndName;
      const groupId = `${worldName} (${worldId})`;

      setAnalyticsGroup(groupKey, groupId);

      return trackDefaultGroupAnalyticsEvent(
        TAKE_SEAT_EVENT_NAME,
        {
          worldId,
          worldName,
          email: user.email,
          venueId: venue.id,
          venueTemplate: venue.template,
        },
        groupId
      );
    },
    [user, venue, worldIdAndName]
  );

  const trackEnterJazzBarEvent = useCallback(
    (groupKey: string = DEFAULT_ANALYTICS_GROUP_KEY) => {
      if (!MIXPANEL_PROJECT_TOKEN || !user || !venue || !worldIdAndName) return;

      const { id: worldId, name: worldName } = worldIdAndName;
      const groupId = `${worldName} (${worldId})`;

      setAnalyticsGroup(groupKey, groupId);

      return trackDefaultGroupAnalyticsEvent(
        ENTER_JAZZ_BAR_EVENT_NAME,
        { worldId, worldName, email: user.email, venueId: venue.id },
        groupId
      );
    },
    [user, venue, worldIdAndName]
  );

  return useMemo(
    () => ({
      initAnalytics,
      identifyUser,
      trackEnterAuditoriumEvent,
      trackEnterJazzBarEvent,
      trackOpenRoomModalEvent,
      trackEnterRoomEvent,
      trackSelectTableEvent,
      trackLogInEvent,
      trackSignUpEvent,
      trackTakeSeatEvent,
      trackVenuePageLoadedEvent,
    }),
    [
      initAnalytics,
      identifyUser,
      trackEnterAuditoriumEvent,
      trackEnterJazzBarEvent,
      trackOpenRoomModalEvent,
      trackEnterRoomEvent,
      trackSelectTableEvent,
      trackLogInEvent,
      trackSignUpEvent,
      trackTakeSeatEvent,
      trackVenuePageLoadedEvent,
    ]
  );
};
