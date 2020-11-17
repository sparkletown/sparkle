import React, { useState, useEffect, useCallback } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useFirestoreConnect } from "react-redux-firebase";

import { LOC_UPDATE_FREQ_MS } from "settings";

import { VenueTemplate } from "types/VenueTemplate";

import { getQueryParameters } from "utils/getQueryParameters";
import { hasUserBoughtTicketForEvent } from "utils/hasUserBoughtTicket";
import { isUserAMember } from "utils/isUserAMember";
import {
  currentEventSelector,
  isCurrentEventRequestedSelector,
  isUserPurchaseHistoryRequestedSelector,
  partygoersSelector,
  shouldRetainAttendanceSelector,
  userPurchaseHistorySelector,
} from "utils/selectors";
import {
  canUserJoinTheEvent,
  currentTimeInUnixEpoch,
  ONE_MINUTE_IN_SECONDS,
} from "utils/time";
import {
  updateLocationData,
  useLocationUpdateEffect,
} from "utils/useLocationUpdateEffect";
import { venueEntranceUrl } from "utils/url";

import { useConnectCurrentEvent } from "hooks/useConnectCurrentEvent";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useConnectPartyGoers } from "hooks/useConnectPartyGoers";
import { useConnectUserPurchaseHistory } from "hooks/useConnectUserPurchaseHistory";
import { useSelector } from "hooks/useSelector";
import { hasData, isLoaded } from "hooks/useSparkleFirestoreConnect";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { ChatContextWrapper } from "components/context/ChatContext";

import { FriendShipPage } from "pages/FriendShipPage";
import { updateUserProfile } from "pages/Account/helpers";

import { ArtPiece } from "components/templates/ArtPiece";
import { AudienceRouter } from "components/templates/Audience/AudienceRouter";
import { AvatarRouter } from "components/templates/AvatarGrid/Router";
import { CampRouter } from "components/templates/Camp/Router";
import { ConversationSpace } from "components/templates/ConversationSpace";
import { JazzbarRouter } from "components/templates/Jazzbar/JazzbarRouter";
import { PartyMap } from "components/templates/PartyMap";
import { PlayaRouter } from "components/templates/Playa/Router";

import { AuthenticationModal } from "components/organisms/AuthenticationModal";
import { WithNavigationBar } from "components/organisms/WithNavigationBar";

import { CountDown } from "components/molecules/CountDown";
import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";

import { updateTheme } from "./helpers";

import "./VenuePage.scss";

const hasPaidEvents = (template: VenueTemplate) => {
  return template === VenueTemplate.jazzbar;
};

const VenuePage = () => {
  const venueId =
    useVenueId() ||
    (getQueryParameters(window.location.search)?.venueId as string);

  const history = useHistory();
  const [currentTimestamp] = useState(Date.now() / 1000);
  const [unmounted, setUnmounted] = useState(false);

  const { user, profile } = useUser();

  const users = useSelector(partygoersSelector);
  const { currentVenue } = useConnectCurrentVenueNG(venueId);
  useConnectCurrentEvent();
  useConnectPartyGoers();
  useConnectUserPurchaseHistory();

  useFirestoreConnect(
    user
      ? {
          collection: "privatechats",
          doc: user.uid,
          subcollections: [{ collection: "chats" }],
          storeAs: "privatechats",
        }
      : undefined
  );

  const currentEvent = useSelector(currentEventSelector);
  const eventRequestStatus = useSelector(isCurrentEventRequestedSelector);

  const userPurchaseHistory = useSelector(userPurchaseHistorySelector);
  const userPurchaseHistoryRequestStatus = useSelector(
    isUserPurchaseHistoryRequestedSelector
  );

  const retainAttendance = useSelector(shouldRetainAttendanceSelector);

  const venueName = currentVenue?.name ?? "";
  const prevLocations = retainAttendance ? profile?.lastSeenIn ?? {} : {};

  const updateUserLocation = useCallback(() => {
    if (!user || !venueName || (venueName && prevLocations[venueName])) return;
    const updatedLastSeenIn = {
      ...prevLocations,
      [venueName]: currentTimeInUnixEpoch,
    };
    updateUserProfile(user.uid, {
      lastSeenIn: updatedLastSeenIn,
      lastSeenAt: new Date().getTime(),
      room: venueName,
    });
  }, [prevLocations, user, venueName]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateUserLocation();
    }, LOC_UPDATE_FREQ_MS);
    return () => {
      clearInterval(interval);
    };
  }, [updateUserLocation]);

  const event = currentEvent?.[0];

  currentVenue && updateTheme(currentVenue);
  const hasUserBoughtTicket =
    event && hasUserBoughtTicketForEvent(userPurchaseHistory, event.id);

  const isEventFinished =
    event &&
    currentTimestamp >
      event.start_utc_seconds + event.duration_minutes * ONE_MINUTE_IN_SECONDS;

  const isUserVenueOwner = user && currentVenue?.owners?.includes(user.uid);
  const isMember =
    user &&
    currentVenue &&
    isUserAMember(user.email, currentVenue.config?.memberEmails);

  // Camp and PartyMap needs to be able to modify this
  // Currently does not work with roome
  const location = venueName;
  useLocationUpdateEffect(user, venueName);

  const newLocation = { [location]: new Date().getTime() };
  const isNewLocation = profile?.lastSeenIn
    ? !profile?.lastSeenIn[location]
    : false;

  const newLocations = {
    ...prevLocations,
    ...newLocation,
  };

  useEffect(() => {
    if (
      user &&
      location &&
      isNewLocation &&
      ((!unmounted && !retainAttendance) || retainAttendance) &&
      (!profile?.lastSeenIn || !profile?.lastSeenIn[location])
    ) {
      updateLocationData(
        user,
        location ? newLocations : prevLocations,
        profile?.lastSeenIn
      );
      setUnmounted(false);
    }
    if (
      user &&
      profile &&
      (profile.lastSeenIn === null || profile?.lastSeenIn === undefined)
    ) {
      updateLocationData(
        user,
        location ? newLocations : prevLocations,
        profile?.lastSeenIn
      );
    }
  }, [
    isNewLocation,
    location,
    newLocation,
    newLocations,
    prevLocations,
    profile,
    retainAttendance,
    unmounted,
    user,
  ]);

  useEffect(() => {
    const leaveRoomBeforeUnload = () => {
      if (user) {
        const locations = { ...prevLocations };
        delete locations[venueName];
        setUnmounted(true);
        updateLocationData(user, locations, undefined);
      }
    };
    window.addEventListener("beforeunload", leaveRoomBeforeUnload, false);
    return () => {
      window.removeEventListener("beforeunload", leaveRoomBeforeUnload, false);
    };
  }, [prevLocations, user, venueName]);

  if (!user) {
    return (
      <WithNavigationBar>
        <AuthenticationModal
          show={true}
          onHide={() => {}}
          showAuth="register"
        />
      </WithNavigationBar>
    );
  }

  if (!isLoaded(currentVenue)) {
    return <LoadingPage />;
  }
  if (!hasData(currentVenue)) {
    return <>This venue does not exist</>;
  }

  if (profile?.enteredVenueIds && !profile.enteredVenueIds?.includes(venueId)) {
    return <Redirect to={venueEntranceUrl(venueId)} />;
  }

  if (
    hasPaidEvents(currentVenue.template) &&
    currentVenue.hasPaidEvents &&
    !isUserVenueOwner
  ) {
    if (eventRequestStatus && !event) {
      return <>This event does not exist</>;
    }

    if (
      !event ||
      !currentVenue ||
      !users ||
      !userPurchaseHistoryRequestStatus
    ) {
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

  if (profile === undefined) {
    return <LoadingPage />;
  }

  if (!(profile?.partyName && profile?.pictureUrl)) {
    history.push(
      `/account/profile?returnUrl=${window.location.pathname}${window.location.search}`
    );
  }

  let template;
  let fullscreen = false;
  switch (currentVenue.template) {
    case VenueTemplate.jazzbar:
      template = <JazzbarRouter />;
      break;
    case VenueTemplate.friendship:
      template = <FriendShipPage />;
      break;
    case VenueTemplate.partymap:
      template = <PartyMap />;
      break;
    case VenueTemplate.artpiece:
      template = <ArtPiece />;
      break;
    case VenueTemplate.themecamp:
      template = <CampRouter />;
      break;
    case VenueTemplate.playa:
    case VenueTemplate.preplaya:
      template = <PlayaRouter />;
      fullscreen = true;
      break;
    case VenueTemplate.zoomroom:
    case VenueTemplate.performancevenue:
    case VenueTemplate.artcar:
      if (currentVenue.zoomUrl) {
        window.location.replace(currentVenue.zoomUrl);
      }
      template = (
        <p>
          Venue {currentVenue.name} should redirect to a URL, but none was set.
          <br />
          <button
            role="link"
            className="btn btn-primary"
            onClick={() => history.goBack()}
          >
            Go Back
          </button>
        </p>
      );
      break;
    case VenueTemplate.audience:
      template = <AudienceRouter />;
      fullscreen = true;
      break;
    case VenueTemplate.avatargrid:
      template = <AvatarRouter />;
      break;
    case VenueTemplate.conversationspace:
      template = <ConversationSpace />;
      break;
  }

  return (
    <ChatContextWrapper>
      <WithNavigationBar fullscreen={fullscreen}>{template}</WithNavigationBar>
    </ChatContextWrapper>
  );
};

export default VenuePage;
