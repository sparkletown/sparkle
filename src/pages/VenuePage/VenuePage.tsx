import firebase from "firebase/app";
import React, { useEffect, Suspense } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useTitle, useAsync } from "react-use";
import { Helmet } from "react-helmet";

import { LOC_UPDATE_FREQ_MS, PLATFORM_BRAND_NAME } from "settings";

import { VenueTemplate, AnyVenue, VenueEvent } from "types/venues";

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
import { tracePromise } from "utils/performance";
import { withVenueId, WithId } from "utils/id";

import { useConnectCurrentEvent } from "hooks/useConnectCurrentEvent";
import { useConnectUserPurchaseHistory } from "hooks/useConnectUserPurchaseHistory";
import { useInterval } from "hooks/useInterval";
import { useMixpanel } from "hooks/useMixpanel";
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

interface PreloadProps {
  venue?: AnyVenue;
}

const Preload: React.FC<PreloadProps> = ({ venue }) => (
  <Helmet>
    {
      // preload the icon only when TemplateWrapper with the navbar icon aren't loaded lazily
      // <link href={SPARKLE_ICON} rel="preload" as="image" />
    }
    {venue?.mapBackgroundImageUrl && (
      <link href={venue?.mapBackgroundImageUrl} rel="preload" as="image" />
    )}
    {
      // NOTE: if there is significant number of rooms, preload might degrade performance, cut down to few
      (venue?.rooms ?? []).map(
        (room) =>
          room?.image_url && (
            <link
              key={room?.image_url}
              href={room.image_url}
              rel="preload"
              as="image"
            />
          )
      )
    }
  </Helmet>
);

const usePreloaded = (venueId?: string) => {
  const { loading, error, value } = useAsync(async () => {
    if (!venueId) return;

    return tracePromise(
      "usePreloadedVenue::getVenue",
      () =>
        firebase
          .functions()
          .httpsCallable("venue-getVenue")({ venueId })
          .then((result) => {
            const data: {
              venue?: WithId<AnyVenue>;
              events?: WithId<VenueEvent>[];
            } = result.data;
            return {
              venue: data?.venue,
              events: isDefined(data?.events)
                ? data.events.map((event) => withVenueId(event, venueId))
                : undefined,
            };
          }),
      {
        attributes: { venueId },
        withDebugLog: true,
      }
    );
  }, [venueId]);

  return {
    venue: value?.venue,
    events: value?.events,
    error,
    isLoaded: !loading && !error,
  };
};

export const VenuePage: React.FC = () => {
  const venueId = useVenueId();
  const {
    venue: preVenue,
    events: preEvents,
    error: preError,
    isLoaded: preLoaded,
  } = usePreloaded(venueId);

  const mixpanel = useMixpanel();

  const history = useHistory();
  // const [isAccessDenied, setIsAccessDenied] = useState(false);

  const { user, profile } = useUser();

  // @debt Remove this once we replace currentVenue with currentVenueNG or similar across all descendant components
  useConnectCurrentVenue();
  const postVenue = useSelector(currentVenueSelector);
  const postVenueLoaded = useSelector(isCurrentVenueRequestedSelector);

  useConnectCurrentEvent();
  const postEvents = useSelector(currentEventSelector);
  const postEventsLoaded = useSelector(isCurrentEventRequestedSelector);

  if (preError) {
    console.warn("VenuePage()", "preload failed:", preError.message);
  }

  const venue = (preError ? undefined : preVenue) ?? postVenue;
  const isVenueLoaded = (preError ? undefined : preLoaded) ?? postVenueLoaded;

  const events = (preError ? undefined : preEvents) ?? postEvents;
  const isEventLoaded = (preError ? undefined : preLoaded) ?? postEventsLoaded;

  useConnectUserPurchaseHistory();
  const userPurchaseHistory = useSelector(userPurchaseHistorySelector);
  const userPurchaseHistoryRequestStatus = useSelector(
    isUserPurchaseHistoryRequestedSelector
  );

  const userId = user?.uid;

  const venueName = venue?.name ?? "";
  const venueTemplate = venue?.template;

  const event = events?.[0];

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

  if (isVenueLoaded && !venue) {
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
    return (
      <>
        <Preload venue={venue} />
        <Login venue={venue} />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Preload venue={venue} />
        {
          // is it really necessary to display loading page here?
          // <LoadingPage />
        }
      </>
    );
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
    if (isEventLoaded && !event) {
      return (
        <>
          <Preload venue={venue} />
          This event does not exist
        </>
      );
    }

    if (!event || !venue || !userPurchaseHistoryRequestStatus) {
      // considering there is prior !venue check, venue should exist at this point
      return (
        <>
          <Preload venue={venue} />
          <Suspense fallback={<></>}>
            <LoadingPage />
          </Suspense>
        </>
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
        <>
          <Preload venue={venue} />
          <Suspense fallback={<></>}>
            <CountDown
              startUtcSeconds={event.start_utc_seconds}
              textBeforeCountdown="Bar opens in"
            />
          </Suspense>
        </>
      );
    }
  }

  // @debt there is already !user check above, this is superfluous
  if (!user) {
    return (
      <>
        <Preload venue={venue} />
        <Suspense fallback={<></>}>
          <LoadingPage />
        </Suspense>
      </>
    );
  }

  if (profile && !isCompleteProfile(profile)) {
    history.push(`/account/profile?venueId=${venueId}`);
  }

  return (
    <>
      <Preload venue={venue} />
      <Suspense fallback={<></>}>
        <TemplateWrapper venue={venue} />
      </Suspense>
    </>
  );
};
