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
  isCurrentEventRequestedSelector,
} from "utils/selectors";
import { wrapIntoSlashes } from "utils/string";
import { isDefined } from "utils/types";
import { accountProfileVenueUrl, venueEntranceUrl } from "utils/url";
import { isCompleteUserInfo } from "utils/user";
import {
  clearLocationData,
  updateLocationData,
  useUpdateTimespentPeriodically,
} from "utils/userLocation";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useAnalytics } from "hooks/useAnalytics";
import { useConnectCurrentEvent } from "hooks/useConnectCurrentEvent";
import { useInterval } from "hooks/useInterval";
import { usePreloadAssets } from "hooks/usePreloadAssets";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";
import { useWorldParams } from "hooks/worlds/useWorldParams";

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
  const { worldSlug } = useWorldParams();
  const { spaceSlug } = useSpaceParams();
  const { space, spaceId, isLoaded } = useSpaceBySlug(spaceSlug);
  const analytics = useAnalytics({ venue: space });
  const { world, isLoaded: isWorldLoaded } = useWorldBySlug(worldSlug);

  // const [isAccessDenied, setIsAccessDenied] = useState(false);

  const { user, profile, userLocation } = useUser();
  const { lastVenueIdSeenIn: userLastSeenIn, enteredVenueIds } =
    userLocation ?? {};

  const assetsToPreload = useMemo(
    () =>
      [
        space?.mapBackgroundImageUrl,
        ...(space?.rooms ?? []).map((room) => room?.image_url),
      ]
        .filter(isDefined)
        .map((url) => ({ url })),
    [space]
  );

  usePreloadAssets(assetsToPreload);

  // @debt Refactor and use reactfire hook instead of this legacy syntax.
  useConnectCurrentEvent();
  const currentEvent = useSelector(currentEventSelector);
  const eventRequestStatus = useSelector(isCurrentEventRequestedSelector);

  const userId = user?.uid;

  const venueName = space?.name ?? "";

  const event = currentEvent?.[0];

  useEffect(() => {
    if (!space) return;

    // @debt replace this with useCss?
    updateTheme(space);
  }, [space]);

  const isEventFinished = event && hasEventFinished(event);

  const isUserVenueOwner = userId && space?.owners?.includes(userId);
  const isMember = user && space;

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
    if (!spaceId || !userId || !profile || enteredVenueIds?.includes(spaceId)) {
      return;
    }

    void updateProfileEnteredVenueIds(enteredVenueIds, userId, spaceId);
  }, [enteredVenueIds, userLocation, userId, spaceId, profile]);
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

  if (!isLoaded) {
    return <LoadingPage />;
  }

  if (!spaceId || !spaceSlug || !space) {
    return (
      <WithNavigationBar hasBackButton withHiddenLoginButton withHome withRadio>
        <NotFound />
      </WithNavigationBar>
    );
  }

  if (!user) {
    return (
      <Suspense fallback={<LoadingPage />}>
        <Login venueId={spaceId} />
      </Suspense>
    );
  }

  if (!profile) {
    return <LoadingPage />;
  }

  const { template, hasPaidEvents } = space;

  const hasEntrance = !!world?.entrance?.length;
  const hasEntered = enteredVenueIds?.includes(spaceId);

  if (hasEntrance && !hasEntered) {
    return <Redirect to={venueEntranceUrl(spaceSlug)} />;
  }

  if (checkSupportsPaidEvents(template) && hasPaidEvents && !isUserVenueOwner) {
    if (eventRequestStatus && !event) {
      return <>This event does not exist</>;
    }

    if (!event || !space) {
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
    return <Redirect to={accountProfileVenueUrl(spaceSlug)} />;
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      <TemplateWrapper venue={space} />
    </Suspense>
  );
};
