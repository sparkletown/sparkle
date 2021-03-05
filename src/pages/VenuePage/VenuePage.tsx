import React, { useState, useEffect, useCallback } from "react";
import { Redirect, useHistory } from "react-router-dom";

import { LOC_UPDATE_FREQ_MS } from "settings";

import { VenueTemplate } from "types/venues";
import { ValidStoreAsKeys } from "types/Firestore";

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
import { canUserJoinTheEvent, ONE_MINUTE_IN_SECONDS } from "utils/time";
import {
  clearLocationData,
  setLocationData,
  updateCurrentLocationData,
  useUpdateTimespentPeriodically,
} from "utils/userLocation";
import { venueEntranceUrl } from "utils/url";
import { showZendeskWidget } from "utils/zendesk";
import { isCompleteProfile, updateProfileEnteredVenueIds } from "utils/profile";
import { isTruthy } from "utils/types";

import { useConnectCurrentEvent } from "hooks/useConnectCurrentEvent";
import { useConnectUserPurchaseHistory } from "hooks/useConnectUserPurchaseHistory";
import { useInterval } from "hooks/useInterval";
import { useMixpanel } from "hooks/useMixpanel";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useVenueAccess } from "hooks/useVenueAccess";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";

import { CountDown } from "components/molecules/CountDown";
import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";
import { AccessDeniedModal } from "components/atoms/AccessDeniedModal/AccessDeniedModal";
import TemplateWrapper from "./TemplateWrapper";

import { updateTheme } from "./helpers";

import "./VenuePage.scss";

import Login from "pages/Account/Login";

const hasPaidEvents = (template: VenueTemplate) => {
  return template === VenueTemplate.jazzbar;
};

const VenuePage: React.FC = () => {
  const venueId = useVenueId();
  const mixpanel = useMixpanel();

  const history = useHistory();
  const [currentTimestamp] = useState(Date.now() / 1000);
  const [isAccessDenied, setIsAccessDenied] = useState(false);

  const { user, profile } = useUser();

  const venue = useSelector(currentVenueSelector);

  const venueRequestStatus = useSelector(isCurrentVenueRequestedSelector);

  const currentEvent = useSelector(currentEventSelector);
  const eventRequestStatus = useSelector(isCurrentEventRequestedSelector);

  const userPurchaseHistory = useSelector(userPurchaseHistorySelector);
  const userPurchaseHistoryRequestStatus = useSelector(
    isUserPurchaseHistoryRequestedSelector
  );

  const userId = user?.uid;

  const venueName = venue?.name ?? "";
  const venueTemplate = venue?.template;

  const event = currentEvent?.[0];

  venue && updateTheme(venue);
  const hasUserBoughtTicket =
    event && hasUserBoughtTicketForEvent(userPurchaseHistory, event.id);

  const isEventFinished =
    event &&
    currentTimestamp >
      event.start_utc_seconds + event.duration_minutes * ONE_MINUTE_IN_SECONDS;

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

  // @debt Remove this once we replace currentVenue with currentVenueNG our firebase
  useConnectCurrentVenue();
  useConnectCurrentEvent();
  useConnectUserPurchaseHistory();
  useFirestoreConnect("venues");

  // @debt refactor this + related code so as not to rely on using a shadowed 'storeAs' key
  //   this should be something like `storeAs: "currentUserPrivateChats"` or similar
  useFirestoreConnect(
    userId
      ? {
          collection: "privatechats",
          doc: userId,
          subcollections: [{ collection: "chats" }],
          storeAs: "privatechats" as ValidStoreAsKeys, // @debt super hacky, but we're consciously subverting our helper protections
        }
      : undefined
  );

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

  const handleAccessDenied = useCallback(() => setIsAccessDenied(true), []);

  useVenueAccess(venue, handleAccessDenied);

  if (!user) {
    return <Login formType="initial" />;
  }

  if (venueRequestStatus && !venue) {
    return <>This venue does not exist</>;
  }

  if (!venue || !venueId || !profile) {
    return <LoadingPage />;
  }

  if (isAccessDenied) {
    return <AccessDeniedModal venueId={venueId} venueName={venue.name} />;
  }

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
      return <LoadingPage />;
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

    if (!canUserJoinTheEvent(event)) {
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

  // return <LoadingPage />;

  if (profile && !isCompleteProfile(profile)) {
    history.push(`/account/profile?venueId=${venueId}`);
  }

  return <TemplateWrapper venue={venue} />;
};

export default VenuePage;
