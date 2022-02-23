import React, { lazy, Suspense, useEffect, useMemo } from "react";
import { Redirect } from "react-router-dom";
import { useTitle } from "react-use";
import { VideoCommsProvider } from "components/attendee/VideoComms/VideoCommsProvider";

import {
  ACCOUNT_PROFILE_VENUE_PARAM_URL,
  ATTENDEE_STEPPING_PARAM_URL,
  DEFAULT_ENTER_STEP,
  LOC_UPDATE_FREQ_MS,
  PLATFORM_BRAND_NAME,
} from "settings";

import { RefiAuthUser } from "types/fire";
import {
  SpaceId,
  SpaceSlugLocation,
  SpaceWithId,
  UserId,
  WorldId,
  WorldWithId,
} from "types/id";
import { Profile, UserLocation } from "types/User";
import { VenueTemplate } from "types/VenueTemplate";

import { hasEventFinished, isEventStartingSoon } from "utils/event";
import { tracePromise } from "utils/performance";
import {
  isCompleteProfile,
  updateProfileEnteredVenueIds,
  updateProfileEnteredWorldIds,
} from "utils/profile";
import { wrapIntoSlashes } from "utils/string";
import { isDefined } from "utils/types";
import { generateUrl } from "utils/url";
import { isCompleteUserInfo } from "utils/user";
import {
  clearLocationData,
  updateLocationData,
  useUpdateTimespentPeriodically,
} from "utils/userLocation";

import { useAnalytics } from "hooks/useAnalytics";
import { useConnectCurrentEvent } from "hooks/useConnectCurrentEvent";
import { useInterval } from "hooks/useInterval";
import { usePreloadAssets } from "hooks/usePreloadAssets";
import { useRelatedVenues } from "hooks/useRelatedVenues";

import { updateUserProfile } from "pages/Account/helpers";

import { CountDown } from "components/molecules/CountDown";
import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";

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

type VenuePageProps = SpaceSlugLocation & {
  space: SpaceWithId;
  spaceId: SpaceId;
  world: WorldWithId;
  worldId: WorldId;
  user?: RefiAuthUser;
  userId?: UserId;
  profile?: Profile;
  userLocation?: UserLocation;
};

export const VenuePage: React.FC<VenuePageProps> = ({
  worldSlug,
  spaceSlug,
  world,
  worldId,
  space,
  spaceId,
  user,
  userId,
  profile,
  userLocation,
}) => {
  const analytics = useAnalytics({ venue: space });

  const {
    lastVenueIdSeenIn: userLastSeenIn,
    enteredVenueIds,
    enteredWorldIds,
  } = userLocation ?? {};

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

  const {
    currentEvent,
    isLoaded: eventRequestStatus,
  } = useConnectCurrentEvent({ worldId, spaceId });

  const venueName = space?.name ?? "";
  const event = currentEvent?.[0];

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

  const handleRejection = (e: unknown) => console.error(VenuePage.name, e);

  // @debt refactor how user location updates works here to encapsulate in a hook or similar?
  useEffect(() => {
    if (!spaceId || !userId || !profile || enteredVenueIds?.includes(spaceId)) {
      return;
    }

    updateProfileEnteredVenueIds(enteredVenueIds, userId, spaceId).catch(
      handleRejection
    );
  }, [enteredVenueIds, userLocation, userId, spaceId, profile]);

  // @debt refactor how user location updates works here to encapsulate in a hook or similar?
  useEffect(() => {
    if (!worldId || !userId || !profile || enteredWorldIds?.includes(worldId)) {
      return;
    }

    updateProfileEnteredWorldIds(enteredWorldIds, userId, worldId).catch(
      handleRejection
    );
  }, [enteredWorldIds, userLocation, userId, worldId, profile]);

  // NOTE: User's timespent updates

  // @debt refactor how user location updates works here to encapsulate in a hook or similar?
  useUpdateTimespentPeriodically({ locationName: venueName, userId });

  // @debt refactor how user location updates works here to encapsulate in a hook or similar?
  useEffect(() => {
    if (!world || !user) return;

    analytics.trackVenuePageLoadedEvent();
  }, [analytics, user, world]);

  const { template, hasPaidEvents } = space;

  const hasEntrance = !!world?.entrance?.length;
  const hasEntered = worldId && enteredWorldIds?.includes(worldId);

  if (hasEntrance && !hasEntered) {
    return (
      <Redirect
        to={generateUrl({
          route: ATTENDEE_STEPPING_PARAM_URL,
          required: ["worldSlug", "spaceSlug", "step"],
          params: { worldSlug, spaceSlug, step: DEFAULT_ENTER_STEP },
        })}
      />
    );
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
          startUtcSeconds={event.startUtcSeconds}
          textBeforeCountdown="Bar opens in"
        />
      );
    }
  }

  if (profile && !isCompleteProfile(profile)) {
    return (
      <Redirect
        to={generateUrl({
          route: ACCOUNT_PROFILE_VENUE_PARAM_URL,
          required: ["worldSlug"],
          params: { worldSlug, spaceSlug },
        })}
      />
    );
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      <VideoCommsProvider>
        <TemplateWrapper venue={space} />
      </VideoCommsProvider>
    </Suspense>
  );
};
