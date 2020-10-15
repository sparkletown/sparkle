import { ChatContextWrapper } from "components/context/ChatContext";
import CountDown from "components/molecules/CountDown";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import ArtPiece from "components/templates/ArtPiece";
import JazzbarRouter from "components/templates/Jazzbar/JazzbarRouter";
import PartyMap from "components/templates/PartyMap";
import useConnectCurrentEvent from "hooks/useConnectCurrentEvent";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import useConnectUserPurchaseHistory from "hooks/useConnectUserPurchaseHistory";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import FriendShipPage from "pages/FriendShipPage";
import React, { useState, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { VenueTemplate } from "types/VenueTemplate";
import { hasUserBoughtTicketForEvent } from "utils/hasUserBoughtTicket";
import { isUserAMember } from "utils/isUserAMember";
import { canUserJoinTheEvent, ONE_MINUTE_IN_SECONDS } from "utils/time";
import {
  leaveRoom,
  updateLocationData,
  useLocationUpdateEffect,
} from "utils/useLocationUpdateEffect";
import { updateTheme } from "./helpers";
import "./VenuePage.scss";
import { PlayaRouter } from "components/templates/Playa/Router";
import { AvatarRouter } from "components/templates/AvatarGrid/Router";
import { CampRouter } from "components/templates/Camp/Router";
import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";
import AuthenticationModal from "components/organisms/AuthenticationModal";
import { useFirestoreConnect, useFirestore } from "react-redux-firebase";
import AudienceRouter from "components/templates/Audience/AudienceRouter";
import { useVenueId } from "hooks/useVenueId";
import { venueEntranceUrl } from "utils/url";
import getQueryParameters from "utils/getQueryParameters";
import ConversationSpace from "components/templates/ConversationSpace";
import { updateUserProfile } from "pages/Account/helpers";

const hasPaidEvents = (template: VenueTemplate) => {
  return template === VenueTemplate.jazzbar;
};

const LOC_UPDATE_FREQ_MS = 50000;

const VenuePage = () => {
  const venueId = useVenueId();
  const firestore = useFirestore();

  const history = useHistory();
  const [currentTimestamp] = useState(Date.now() / 1000);

  const { user, profile } = useUser();
  const {
    venue,
    users,
    userPurchaseHistory,
    userPurchaseHistoryRequestStatus,
    currentEvent,
    eventRequestStatus,
    venueRequestStatus,
    retainAttendance,
  } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
    venueRequestStatus: state.firestore.status.requested.currentVenue,
    users: state.firestore.ordered.partygoers,
    currentEvent: state.firestore.ordered.currentEvent,
    eventRequestStatus: state.firestore.status.requested.currentEvent,
    eventPurchase: state.firestore.data.eventPurchase,
    eventPurchaseRequestStatus: state.firestore.status.requested.eventPurchase,
    userPurchaseHistory: state.firestore.ordered.userPurchaseHistory,
    userPurchaseHistoryRequestStatus:
      state.firestore.status.requested.userPurchaseHistory,
    retainAttendance: state.attendance.retainAttendance,
  }));

  useEffect(() => {
    const onClickWindow = (event: any) => {
      // event.target.id &&
      //   user &&
      //   analytics.logEvent("clickonbutton", {
      //     buttonId: event.target.id,
      //     userId: user.uid,
      //   });
    };

    const leaveRoomBeforeUnload = () => {
      if (user && !retainAttendance) {
        leaveRoom(user);
      }
    };
    window.addEventListener("click", onClickWindow, false);
    window.addEventListener("beforeunload", leaveRoomBeforeUnload, false);
    return () => {
      window.removeEventListener("click", onClickWindow, false);
      window.removeEventListener("beforeunload", leaveRoomBeforeUnload, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const venueName = venue?.name ?? "";
    const prevLocations = profile?.lastSeenIn ?? {};
    const interval = setInterval(() => {
      if (!user) return;
      const updatedLastSeenIn = {
        ...prevLocations,
        [venueName]: new Date().getTime() / 1000,
      };
      updateUserProfile(user.uid, {
        lastSeenIn: updatedLastSeenIn,
        lastSeenAt: new Date().getTime(),
        room: venueName,
      });
    }, LOC_UPDATE_FREQ_MS);
    return () => {
      clearInterval(interval);
      if (retainAttendance && user && profile) {
        updateUserProfile(user.uid, {
          lastSeenIn: { ...prevLocations, [venueName]: 0 },
          lastSeenAt: new Date().getTime(),
          room: null,
        });
      }
    };
  }, [profile, retainAttendance, user, venue]);

  const event = currentEvent?.[0];

  venue && updateTheme(venue);
  const hasUserBoughtTicket =
    event && hasUserBoughtTicketForEvent(userPurchaseHistory, event.id);

  const isEventFinished =
    event &&
    currentTimestamp >
      event.start_utc_seconds + event.duration_minutes * ONE_MINUTE_IN_SECONDS;

  const isUserVenueOwner = user && venue?.owners?.includes(user.uid);
  const isMember =
    user && venue && isUserAMember(user.email, venue.config?.memberEmails);

  const venueName = venue?.name ?? "";
  // Camp and PartyMap needs to be able to modify this
  // Currently does not work with roome
  const location = venueName;
  useLocationUpdateEffect(user, venueName);

  useEffect(() => {
    console.log("profile", profile);
    const prevLocations = profile?.lastSeenIn ?? {};

    if (prevLocations !== profile?.lastSeenIn && user && location) {
      console.log("prevLocations", prevLocations);
      const newLocations = {
        ...prevLocations,
        [location]: new Date().getTime(),
      };
      updateLocationData(
        user,
        location ? newLocations : prevLocations,
        profile?.lastSeenIn
      );
    }
  }, [location, user, profile]);

  const venueIdFromParams = getQueryParameters(window.location.search)
    ?.venueId as string;

  useConnectPartyGoers();
  useConnectCurrentEvent();
  useConnectUserPurchaseHistory();
  useEffect(() => {
    firestore.get({
      collection: "venues",
      doc: venueId ? venueId : venueIdFromParams,
      storeAs: "currentVenue",
    });
  }, [firestore, venueId, venueIdFromParams]);
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

  if (!venue || !venueId) {
    return <LoadingPage />;
  }

  if (profile?.enteredVenueIds && !profile.enteredVenueIds?.includes(venueId)) {
    return <Redirect to={venueEntranceUrl(venueId)} />;
  }

  if (venueRequestStatus && !venue) {
    return <>This venue does not exist</>;
  }

  if (
    hasPaidEvents(venue.template) &&
    venue.hasPaidEvents &&
    !isUserVenueOwner
  ) {
    if (eventRequestStatus && !event) {
      return <>This event does not exist</>;
    }

    if (!event || !venue || !users || !userPurchaseHistoryRequestStatus) {
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
  switch (venue.template) {
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
      if (venue.zoomUrl) {
        window.location.replace(venue.zoomUrl);
      }
      template = (
        <p>
          Venue {venue.name} should redirect to a URL, but none was set.
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
