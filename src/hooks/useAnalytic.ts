import { useCallback, useMemo } from "react";
// eslint-disable-next-line no-restricted-imports
import mixpanel, { Mixpanel } from "mixpanel-browser";

import { MIXPANEL_PROJECT_TOKEN } from "secrets";

import {
  DEFAULT_ANALYTIC_GROUP_KEY,
  DEFAULT_ANALYTIC_WORLD_NAME,
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

import { ReactHook } from "types/utility";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useCurrentWorld } from "hooks/useCurrentWorld";
import { useUser } from "hooks/useUser";

const setAnalyticGroup = (groupKey: string, groupId: string) => {
  mixpanel.set_group(groupKey, groupId);
  mixpanel.get_group(groupKey, groupId).set({ $name: groupId });
};

interface UseAnalyticProps {
  venue?: WithId<AnyVenue>;
}

interface UseAnalyticResult {
  initAnalytic: (opts?: Object) => Mixpanel | undefined;
  identifyAnalyticUser: (email: string, name?: string) => void;
  trackVenuePageLoadedEvent: (worldName: string, groupKey?: string) => void;
  trackLogInEvent: (email: string) => void;
  trackSignUpEvent: (email: string) => void;
  trackOpenRoomModalEvent: (roomTitle?: string, groupKey?: string) => void;
  trackEnterRoomEvent: (roomTemplate?: string, groupKey?: string) => void;
  trackEnterAuditoriumEvent: (groupKey?: string) => void;
  trackSelectTableEvent: (groupKey?: string) => void;
  trackTakeSeatEvent: (groupKey?: string) => void;
  trackEnterJazzBarEvent: (groupKey?: string) => void;
}

export const useAnalytic: ReactHook<UseAnalyticProps, UseAnalyticResult> = ({
  venue,
}) => {
  const { user } = useUser();
  const { world, isLoaded: isWorldLoaded } = useCurrentWorld({
    worldId: venue?.worldId,
  });

  const worldName = isWorldLoaded
    ? world?.name || DEFAULT_ANALYTIC_WORLD_NAME
    : "";

  const initAnalytic = useCallback((opts?: Object) => {
    if (!MIXPANEL_PROJECT_TOKEN) {
      console.warn("Mixpanel is not set up correctly.");
      return;
    }

    return mixpanel.init(MIXPANEL_PROJECT_TOKEN, opts);
  }, []);

  const identifyAnalyticUser = useCallback((email: string, name = "N/A") => {
    if (!MIXPANEL_PROJECT_TOKEN) return;

    mixpanel.identify(email);
    mixpanel.people.set({ $email: email, $name: name });
  }, []);

  const trackLogInEvent = useCallback(
    (email: string) => {
      if (!MIXPANEL_PROJECT_TOKEN || !email || !venue) return;

      setAnalyticGroup(DEFAULT_ANALYTIC_GROUP_KEY, DEFAULT_ANALYTIC_WORLD_NAME);

      return mixpanel.track_with_groups(
        LOG_IN_EVENT_NAME,
        { email: email, venueId: venue.id },
        { [DEFAULT_ANALYTIC_GROUP_KEY]: DEFAULT_ANALYTIC_WORLD_NAME }
      );
    },
    [venue]
  );

  const trackSignUpEvent = useCallback((email: string) => {
    if (!MIXPANEL_PROJECT_TOKEN || !email) return;

    setAnalyticGroup(DEFAULT_ANALYTIC_GROUP_KEY, DEFAULT_ANALYTIC_WORLD_NAME);

    return mixpanel.track_with_groups(
      SIGN_UP_EVENT_NAME,
      { email },
      { [DEFAULT_ANALYTIC_GROUP_KEY]: DEFAULT_ANALYTIC_WORLD_NAME }
    );
  }, []);

  const trackVenuePageLoadedEvent = useCallback(
    (worldName: string, groupKey: string = DEFAULT_ANALYTIC_GROUP_KEY) => {
      if (!MIXPANEL_PROJECT_TOKEN || !venue || !worldName || !user) return;

      setAnalyticGroup(groupKey, worldName);

      return mixpanel.track_with_groups(
        VENUE_PAGE_LOADED_EVENT_NAME,
        { worldId: worldName, template: venue.template },
        { [groupKey]: worldName }
      );
    },
    [user, venue]
  );

  const trackOpenRoomModalEvent = useCallback(
    (roomTitle?: string, groupKey: string = DEFAULT_ANALYTIC_GROUP_KEY) => {
      if (
        !MIXPANEL_PROJECT_TOKEN ||
        !user ||
        !venue ||
        !worldName ||
        !roomTitle
      )
        return;

      setAnalyticGroup(groupKey, worldName);

      return mixpanel.track_with_groups(
        OPEN_ROOM_MODAL_EVENT_NAME,
        {
          worldId: worldName,
          email: user.email,
          roomName: roomTitle,
          venueId: venue.id,
        },
        { [groupKey]: worldName }
      );
    },
    [user, venue, worldName]
  );

  const trackEnterRoomEvent = useCallback(
    (roomTemplate?: string, groupKey: string = DEFAULT_ANALYTIC_GROUP_KEY) => {
      if (
        !MIXPANEL_PROJECT_TOKEN ||
        !user ||
        !venue ||
        !worldName ||
        !roomTemplate
      )
        return;

      setAnalyticGroup(groupKey, worldName);

      return mixpanel.track_with_groups(
        ENTER_ROOM_EVENT_NAME,
        {
          worldId: worldName,
          email: user.email,
          roomTemplate: roomTemplate,
          venueId: venue.id,
        },
        { [groupKey]: worldName }
      );
    },
    [user, venue, worldName]
  );

  const trackEnterAuditoriumEvent = useCallback(
    (groupKey: string = DEFAULT_ANALYTIC_GROUP_KEY) => {
      if (!MIXPANEL_PROJECT_TOKEN || !user || !venue || !worldName) return;

      setAnalyticGroup(groupKey, worldName);

      return mixpanel.track_with_groups(
        ENTER_AUDITORIUM_EVENT_NAME,
        { worldId: worldName, email: user.email, venueId: venue.id },
        { [groupKey]: worldName }
      );
    },
    [user, venue, worldName]
  );

  const trackSelectTableEvent = useCallback(
    (groupKey: string = DEFAULT_ANALYTIC_GROUP_KEY) => {
      if (!MIXPANEL_PROJECT_TOKEN || !user || !venue || !worldName) return;

      setAnalyticGroup(groupKey, worldName);

      return mixpanel.track_with_groups(
        SELECT_TABLE_EVENT_NAME,
        {
          worldId: worldName,
          email: user.email,
          venueId: venue.id,
          venueTemplate: venue.template,
        },
        { [groupKey]: worldName }
      );
    },
    [user, venue, worldName]
  );

  const trackTakeSeatEvent = useCallback(
    (groupKey: string = DEFAULT_ANALYTIC_GROUP_KEY) => {
      if (!MIXPANEL_PROJECT_TOKEN || !user || !venue || !worldName) return;

      setAnalyticGroup(groupKey, worldName);

      return mixpanel.track_with_groups(
        TAKE_SEAT_EVENT_NAME,
        {
          worldId: worldName,
          email: user.email,
          venueId: venue.id,
          venueTemplate: venue.template,
        },
        { [groupKey]: worldName }
      );
    },
    [user, venue, worldName]
  );

  const trackEnterJazzBarEvent = useCallback(
    (groupKey: string = DEFAULT_ANALYTIC_GROUP_KEY) => {
      if (!MIXPANEL_PROJECT_TOKEN || !user || !venue || !worldName) return;

      setAnalyticGroup(groupKey, worldName);

      return mixpanel.track_with_groups(
        ENTER_JAZZ_BAR_EVENT_NAME,
        { worldId: worldName, email: user.email, venueId: venue.id },
        { [groupKey]: worldName }
      );
    },
    [user, venue, worldName]
  );

  return useMemo(
    () => ({
      initAnalytic,
      identifyAnalyticUser,
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
      initAnalytic,
      identifyAnalyticUser,
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
