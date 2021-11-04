import React, { lazy, Suspense, useEffect, useMemo } from "react";
import { Redirect } from "react-router-dom";
import { useTitle } from "react-use";

import { LOC_UPDATE_FREQ_MS, PLATFORM_BRAND_NAME } from "settings";

import { VenueTemplate } from "types/venues";

import { hasEventFinished, isEventStartingSoon } from "utils/event";
import { tracePromise } from "utils/performance";
import { isCompleteProfile, updateProfileEnteredVenueIds } from "utils/profile";
import {
  currentEventSelector,
  currentVenueSelector,
  isCurrentEventRequestedSelector,
  isCurrentVenueRequestedSelector,
} from "utils/selectors";
import { wrapIntoSlashes } from "utils/string";
import { isDefined } from "utils/types";
import { venueEntranceUrl } from "utils/url";
import { isCompleteUserInfo } from "utils/user";
import {
  clearLocationData,
  updateLocationData,
  useUpdateTimespentPeriodically,
} from "utils/userLocation";

import { useAnalytics } from "hooks/useAnalytics";
import { useConnectCurrentEvent } from "hooks/useConnectCurrentEvent";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { useCurrentWorld } from "hooks/useCurrentWorld";
import { useInterval } from "hooks/useInterval";
import { usePreloadAssets } from "hooks/usePreloadAssets";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { updateUserProfile } from "pages/Account/helpers";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { CountDown } from "components/molecules/CountDown";
import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";

import { NotFound } from "components/atoms/NotFound";

import { updateTheme } from "./helpers";

import "./VenuePage.scss";

const Login = lazy(() =>
  tracePromise("VenuePage::lazy-import::Login", () =>
    import("pages/Account/Login").then(({ Login }) => ({
      default: Login,
    }))
  )
);

const TemplateWrapper = lazy(() =>
  tracePromise("VenuePage::lazy-import::TemplateWrapper", () =>
    import("./TemplateWrapper").then(({ TemplateWrapper }) => ({
      default: TemplateWrapper,
    }))
  )
);

// @debt Refactor this constant into settings, or types/templates, or similar?
const checkSupportsPaidEvents = (template: VenueTemplate) =>
  template === VenueTemplate.jazzbar;

export const VenuePage: React.FC = () => {
  const venueId = useVenueId();
  const venue = useSelector(currentVenueSelector);
  const analytics = useAnalytics({ venue });
  const { world, isLoaded: isWorldLoaded } = useCurrentWorld({
    worldId: venue?.worldId,
  });

  // const [isAccessDenied, setIsAccessDenied] = useState(false);

  const { user, profile, userLocation } = useUser();
  const { lastVenueIdSeenIn: userLastSeenIn, enteredVenueIds } =
    userLocation ?? {};

  // @debt Remove this once we replace currentVenue with currentVenueNG or similar across all descendant components
  useConnectCurrentVenue();

  const venueRequestStatus = useSelector(isCurrentVenueRequestedSelector);

  const assetsToPreload = useMemo(
    () =>
      [
        venue?.mapBackgroundImageUrl,
        ...(venue?.rooms ?? []).map((room) => room?.image_url),
      ]
        .filter(isDefined)
        .map((url) => ({ url })),
    [venue]
  );

  usePreloadAssets(assetsToPreload);

  useConnectCurrentEvent();
  const currentEvent = useSelector(currentEventSelector);
  const eventRequestStatus = useSelector(isCurrentEventRequestedSelector);

  const userId = user?.uid;

  const venueName = venue?.name ?? "";

  const event = currentEvent?.[0];

  useEffect(() => {
    if (!venue) return;

    // @debt replace this with useCss?
    updateTheme(venue);
  }, [venue]);

  const isEventFinished = event && hasEventFinished(event);

  const isUserVenueOwner = userId && venue?.owners?.includes(userId);
  const isMember = user && venue;

  // NOTE: User location updates
  // @debt refactor how user location updates works here to encapsulate in a hook or similar?
  useInterval(() => {
    if (!userId || !userLastSeenIn) return;

    updateLocationData({
      userId,
      newLocationPath: userLastSeenIn,
    });
  }, LOC_UPDATE_FREQ_MS);

  const { sovereignVenueId, sovereignVenueDescendantIds } = useRelatedVenues();

  // @debt refactor how user location updates works here to encapsulate in a hook or similar?
  useEffect(() => {
    if (!userId || !sovereignVenueId || !sovereignVenueDescendantIds) return;

    const allVenueIds = [
      ...sovereignVenueDescendantIds,
      sovereignVenueId,
    ].reverse();

    const locationPath = wrapIntoSlashes(allVenueIds.join("/"));

    updateLocationData({ userId, newLocationPath: locationPath });
  }, [userId, sovereignVenueId, sovereignVenueDescendantIds]);

  useEffect(() => {
    if (
      user &&
      profile &&
      !isCompleteProfile(profile) &&
      isCompleteUserInfo(user)
    ) {
      const profileData = {
        pictureUrl: user.photoURL ?? "",
        partyName: user.displayName ?? "",
      };
      updateUserProfile(user?.uid, profileData);
    }
  }, [user, profile]);

  useTitle(`${PLATFORM_BRAND_NAME} - ${venueName}`);

  // @debt refactor how user location updates works here to encapsulate in a hook or similar?
  useEffect(() => {
    if (!userId) return;

    const onBeforeUnloadHandler = () => clearLocationData(userId);

    // NOTE: Clear user location on page close
    window.addEventListener("beforeunload", onBeforeUnloadHandler);

    return () =>
      window.removeEventListener("beforeunload", onBeforeUnloadHandler);
  }, [userId]);

  // @debt refactor how user location updates works here to encapsulate in a hook or similar?
  useEffect(() => {
    if (!venueId || !userId || !profile || enteredVenueIds?.includes(venueId)) {
      return;
    }

    void updateProfileEnteredVenueIds(enteredVenueIds, userId, venueId);
  }, [enteredVenueIds, userLocation, userId, venueId, profile]);
  // NOTE: User's timespent updates

  // @debt refactor how user location updates works here to encapsulate in a hook or similar?
  useUpdateTimespentPeriodically({ locationName: venueName, userId });

  // @debt refactor how user location updates works here to encapsulate in a hook or similar?
  useEffect(() => {
    if (!isWorldLoaded || !world || !user) return;

    analytics.trackVenuePageLoadedEvent();
  }, [analytics, isWorldLoaded, user, world]);

  // const handleAccessDenied = useCallback(() => setIsAccessDenied(true), []);

  // useVenueAccess(venue, handleAccessDenied);

  if (venueRequestStatus && !venue) {
    return (
      <WithNavigationBar hasBackButton hideLoginButton>
        <NotFound />
      </WithNavigationBar>
    );
  }

  if (!venue || !venueId) {
    return <LoadingPage />;
  }

  if (!user) {
    return (
      <Suspense fallback={<LoadingPage />}>
        <Login venueId={venueId} />
      </Suspense>
    );
  }

  if (!profile) {
    return <LoadingPage />;
  }

  const { entrance, template, hasPaidEvents } = venue;

  const hasEntrance = Array.isArray(entrance) && entrance.length > 0;
  const hasEntered = enteredVenueIds?.includes(venueId);

  if (hasEntrance && !hasEntered) {
    return <Redirect to={venueEntranceUrl(venueId)} />;
  }

  if (checkSupportsPaidEvents(template) && hasPaidEvents && !isUserVenueOwner) {
    if (eventRequestStatus && !event) {
      return <>This event does not exist</>;
    }

    if (!event || !venue) {
      return <LoadingPage />;
    }

    if (!isMember || isEventFinished) {
      return <>Forbidden</>;
    }

    if (isEventStartingSoon(event)) {
      return (
        <CountDown
          startUtcSeconds={event.start_utc_seconds}
          textBeforeCountdown="Bar opens in"
        />
      );
    }
  }

  if (!user) {
    return <LoadingPage />;
  }

  if (profile && !isCompleteProfile(profile)) {
    return <Redirect to={`/account/profile?venueId=${venueId}`} />;
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      <TemplateWrapper venue={venue} />
    </Suspense>
  );
};
