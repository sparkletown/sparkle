import firebase from "firebase/app";
import React, { useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useTitle, useAsync } from "react-use";
import { Helmet } from "react-helmet";

import {
  LOC_UPDATE_FREQ_MS,
  PLATFORM_BRAND_NAME,
  SPARKLE_ICON,
} from "settings";

import { VenueTemplate, AnyVenue } from "types/venues";

import { hasUserBoughtTicketForEvent } from "utils/hasUserBoughtTicket";
import { isUserAMember } from "utils/isUserAMember";
import {
  currentEventSelector,
  isCurrentEventRequestedSelector,
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
import { withId } from "utils/id";

import { useConnectCurrentEvent } from "hooks/useConnectCurrentEvent";
import { useConnectUserPurchaseHistory } from "hooks/useConnectUserPurchaseHistory";
import { useInterval } from "hooks/useInterval";
import { useMixpanel } from "hooks/useMixpanel";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
// import { useVenueAccess } from "hooks/useVenueAccess";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";

import { CountDown } from "components/molecules/CountDown";
import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";
// import { AccessDeniedModal } from "components/atoms/AccessDeniedModal/AccessDeniedModal";
import TemplateWrapper from "./TemplateWrapper";

import { updateTheme } from "./helpers";

import Login from "pages/Account/Login";

import "./VenuePage.scss";

// @debt Refactor this constant into settings, or types/templates, or similar?
const hasPaidEvents = (template: VenueTemplate) => {
  return template === VenueTemplate.jazzbar;
};

interface PreloadProps {
  venue?: AnyVenue;
}

const Preload: React.FC<PreloadProps> = ({ venue }) => (
  <Helmet>
    <link href={SPARKLE_ICON} rel="preload" as="image" />
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

const usePreloadedVenue = (venueId?: string) => {
  const { loading, error, value: venue } = useAsync(async () => {
    if (!venueId) return;

    return tracePromise(
      "usePreloadedVenue::getVenue",
      () =>
        firebase
          .functions()
          .httpsCallable("venue-getVenue")({ venueId })
          .then((result) => {
            const data: AnyVenue | undefined = result.data;
            return isDefined(data) ? withId(data, venueId) : undefined;
          }),
      {
        attributes: { venueId },
        withDebugLog: true,
      }
    );
  }, [venueId]);

  if (error) {
    console.warn("usePreloadedVenue()", error);
  }

  return {
    venue,
    error,
    isVenueLoading: loading,
    venueRequestStatus: !loading && !error,
  };
};

const VenuePage: React.FC = () => {
  const venueId = useVenueId();
  const { venue, venueRequestStatus } = usePreloadedVenue(venueId);

  const mixpanel = useMixpanel();

  const history = useHistory();
  // const [isAccessDenied, setIsAccessDenied] = useState(false);

  const { user, profile } = useUser();

  // @debt Remove this once we replace currentVenue with currentVenueNG or similar across all descendant components
  useConnectCurrentVenue();
  // const venue = useSelector(currentVenueSelector);
  // const venueRequestStatus = useSelector(isCurrentVenueRequestedSelector);

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
    console.log("VenuePage()", "01 bail out reason:", {
      venueRequestStatus,
      venue,
    });
    return <>This venue does not exist</>;
  }

  if (!venueId) {
    // this should be happening only if invalid url param
    // no sense in displaying loading page, another message or action is needed
    // @debt use/display proper message/action when !venueId
    console.log("VenuePage()", "02 bail out reason:", { venueId });
    return null;
  }

  if (!venue) {
    // too common, don't spam console, also be optimistic venue will load soon
    // return <LoadingPage />;
    return null;
  }

  if (!user) {
    console.log("VenuePage()", "03 bail out reason:", { user });
    return (
      <>
        <Preload venue={venue} />
        <Login venue={venue} />
      </>
    );
  }

  if (!profile) {
    console.log("VenuePage()", "04 bail out reason:", { profile });
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
    console.log("VenuePage()", "05 bail out reason:", {
      hasEntrance,
      hasEntered,
    });
    return <Redirect to={venueEntranceUrl(venueId)} />;
  }

  if (
    hasPaidEvents(venue.template) &&
    venue.hasPaidEvents &&
    !isUserVenueOwner
  ) {
    if (eventRequestStatus && !event) {
      console.log("VenuePage()", "06 bail out reason:", {
        eventRequestStatus,
        event,
      });
      return (
        <>
          <Preload venue={venue} />
          This event does not exist
        </>
      );
    }

    if (!event || !venue || !userPurchaseHistoryRequestStatus) {
      console.log("VenuePage()", "07 bail out reason:", {
        event,
        venue,
        userPurchaseHistoryRequestStatus,
      });
      // considering there is prior !venue check, venue should exist at this point
      return (
        <>
          <Preload venue={venue} />
          <LoadingPage />
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
      console.log("VenuePage()", "08 bail out reason:", {
        isMember,
        "event.price > 0": event.price > 0,
        userPurchaseHistoryRequestStatus,
        hasUserBoughtTicket,
      });
      return <>Forbidden</>;
    }

    if (isEventStartingSoon(event)) {
      console.log("VenuePage()", "09 bail out reason:", {
        isEventStartingSoon: true,
      });
      return (
        <>
          <Preload venue={venue} />
          <CountDown
            startUtcSeconds={event.start_utc_seconds}
            textBeforeCountdown="Bar opens in"
          />
        </>
      );
    }
  }

  // @debt there is already !user check above, this is superfluous
  if (!user) {
    console.log("VenuePage()", "10 bail out reason:", { user });
    return (
      <>
        <Preload venue={venue} />
        <LoadingPage />
      </>
    );
  }

  if (profile && !isCompleteProfile(profile)) {
    history.push(`/account/profile?venueId=${venueId}`);
  }

  return (
    <>
      <Preload venue={venue} />
      <TemplateWrapper venue={venue} />
    </>
  );
};

export default VenuePage;
