import React, { useEffect, Suspense } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useTitle } from "react-use";

import { LOC_UPDATE_FREQ_MS, PLATFORM_BRAND_NAME } from "settings";

import { VenueTemplate } from "types/venues";

import { hasUserBoughtTicketForEvent } from "utils/hasUserBoughtTicket";
import { isUserAMember } from "utils/isUserAMember";
import {
  currentEventSelector,
  currentVenueSelector,
  isCurrentEventRequestedSelector,
  isCurrentVenueRequestedSelector,
  isUserPurchaseHistoryRequestedSelector,
  userPurchaseHistorySelector,
} from "utils/selectors";
import {
  clearLocationData,
  setLocationData,
  updateCurrentLocationData,
  useUpdateTimespentPeriodically,
} from "utils/userLocation";
import { venueEntranceUrl } from "utils/url";
import { showZendeskWidget } from "utils/zendesk";
import { isCompleteProfile, updateProfileEnteredVenueIds } from "utils/profile";
import { isTruthy, isDefined } from "utils/types";
import { hasEventFinished, isEventStartingSoon } from "utils/event";

import { useConnectCurrentEvent } from "hooks/useConnectCurrentEvent";
import { useConnectUserPurchaseHistory } from "hooks/useConnectUserPurchaseHistory";
import { useInterval } from "hooks/useInterval";
import { useMixpanel } from "hooks/useMixpanel";
import { usePreloadAssets } from "hooks/usePreloadAssets";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
// import { useVenueAccess } from "hooks/useVenueAccess";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";

import { updateTheme } from "./helpers";

import Login from "pages/Account/Login";

import "./VenuePage.scss";

const CountDown = React.lazy(() =>
  import("components/molecules/CountDown").then((m) => ({
    default: m.CountDown,
  }))
);
const LoadingPage = React.lazy(() =>
  import("components/molecules/LoadingPage/LoadingPage").then((m) => ({
    default: m.LoadingPage,
  }))
);
const TemplateWrapper = React.lazy(() => import("./TemplateWrapper"));

// @debt Refactor this constant into settings, or types/templates, or similar?
const hasPaidEvents = (template: VenueTemplate) => {
  return template === VenueTemplate.jazzbar;
};

export const VenuePage: React.FC = () => {
  const venueId = useVenueId();
  const mixpanel = useMixpanel();

  const history = useHistory();
  // const [isAccessDenied, setIsAccessDenied] = useState(false);

  const { user, profile } = useUser();

  // @debt Remove this once we replace currentVenue with currentVenueNG or similar across all descendant components
  useConnectCurrentVenue();
  const venue = useSelector(currentVenueSelector);
  const venueRequestStatus = useSelector(isCurrentVenueRequestedSelector);

  usePreloadAssets(
    [
      venue?.mapBackgroundImageUrl,
      ...(venue?.rooms ?? []).map((room) => room?.image_url),
    ]
      .filter(isDefined)
      .map((url) => ({ url }))
  );

  useConnectCurrentEvent();
  const currentEvent = useSelector(currentEventSelector);
  const eventRequestStatus = useSelector(isCurrentEventRequestedSelector);

  useConnectUserPurchaseHistory();
  const userPurchaseHistory = useSelector(userPurchaseHistorySelector);
  const userPurchaseHistoryRequestStatus = useSelector(
    isUserPurchaseHistoryRequestedSelector
  );

  const userId = user?.uid;

  const venueName = venue?.name ?? "";
  const venueTemplate = venue?.template;

  const event = currentEvent?.[0];

  useEffect(() => {
    if (!venue) return;

    // @debt replace this with useCss?
    updateTheme(venue);
  }, [venue]);

  const hasUserBoughtTicket =
    event && hasUserBoughtTicketForEvent(userPurchaseHistory, event.id);

  const isEventFinished = event && hasEventFinished(event);

  const isUserVenueOwner = userId && venue?.owners?.includes(userId);
  const isMember =
    user && venue && isUserAMember(user.email, venue.config?.memberEmails);

  // NOTE: User location updates

  useInterval(() => {
    if (!userId || !profile?.lastSeenIn) return;

    updateCurrentLocationData({
      userId,
      profileLocationData: profile.lastSeenIn,
    });
  }, LOC_UPDATE_FREQ_MS);

  useEffect(() => {
    if (!userId || !venueName) return;

    setLocationData({ userId, locationName: venueName });
  }, [userId, venueName]);

  useTitle(`${PLATFORM_BRAND_NAME} - ${venueName}`);

  useEffect(() => {
    if (!userId) return;

    const onBeforeUnloadHandler = () => clearLocationData(userId);

    // NOTE: Clear user location on page close
    window.addEventListener("beforeunload", onBeforeUnloadHandler);

    return () =>
      window.removeEventListener("beforeunload", onBeforeUnloadHandler);
  }, [userId]);

  useEffect(() => {
    if (
      !venueId ||
      !userId ||
      !profile ||
      profile?.enteredVenueIds?.includes(venueId)
    ) {
      return;
    }

    updateProfileEnteredVenueIds(profile?.enteredVenueIds, userId, venueId);
  }, [profile, userId, venueId]);

  // NOTE: User's timespent updates

  useUpdateTimespentPeriodically({ locationName: venueName, userId });

  useEffect(() => {
    if (user && profile && venueId && venueTemplate) {
      mixpanel.track("VenuePage loaded", {
        venueId,
        template: venueTemplate,
      });
    }
  }, [user, profile, venueId, venueTemplate, mixpanel]);

  useEffect(() => {
    if (venue?.showZendesk) {
      showZendeskWidget();
    }
  }, [venue]);

  // const handleAccessDenied = useCallback(() => setIsAccessDenied(true), []);

  // useVenueAccess(venue, handleAccessDenied);

  if (venueRequestStatus && !venue) {
    return <>This venue does not exist</>;
  }

  if (!venueId) {
    // this should be happening only if invalid url param
    // no sense in displaying loading page, another message or action is needed
    // @debt use/display proper message/action when !venueId
    return null;
  }

  if (!venue) {
    return (
      <Suspense fallback={<></>}>
        <LoadingPage />
      </Suspense>
    );
  }

  if (!user) {
    return <Login venue={venue} />;
  }

  if (!profile) {
    // is it really necessary to display loading page here?
    // return <LoadingPage /> ;
    return <></>;
  }

  // if (isAccessDenied) {
  //   return <AccessDeniedModal venueId={venueId} venueName={venue.name} />;
  // }

  const hasEntrance = isTruthy(venue?.entrance);
  const hasEntered = profile?.enteredVenueIds?.includes(venueId);
  if (hasEntrance && !hasEntered) {
    return <Redirect to={venueEntranceUrl(venueId)} />;
  }

  if (
    hasPaidEvents(venue.template) &&
    venue.hasPaidEvents &&
    !isUserVenueOwner
  ) {
    if (eventRequestStatus && !event) {
      return <>This event does not exist</>;
    }

    if (!event || !venue || !userPurchaseHistoryRequestStatus) {
      // considering there is prior !venue check, venue should exist at this point
      return (
        <Suspense fallback={<></>}>
          <LoadingPage />
        </Suspense>
      );
    }

    if (
      (!isMember &&
        event.price > 0 &&
        userPurchaseHistoryRequestStatus &&
        !hasUserBoughtTicket) ||
      isEventFinished
    ) {
      return <>Forbidden</>;
    }

    if (isEventStartingSoon(event)) {
      return (
        <Suspense fallback={<></>}>
          <CountDown
            startUtcSeconds={event.start_utc_seconds}
            textBeforeCountdown="Bar opens in"
          />
        </Suspense>
      );
    }
  }

  // @debt there is already !user check above, this is superfluous
  if (!user) {
    return (
      <Suspense fallback={<></>}>
        <LoadingPage />
      </Suspense>
    );
  }

  if (profile && !isCompleteProfile(profile)) {
    history.push(`/account/profile?venueId=${venueId}`);
  }

  return (
    <Suspense fallback={<></>}>
      <TemplateWrapper venue={venue} />
    </Suspense>
  );
};
