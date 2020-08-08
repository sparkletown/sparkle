import React, { useState } from "react";
import useUpdateLocationEffect from "utils/useLocationUpdateEffect";
import JazzbarRouter from "components/templates/Jazzbar/JazzbarRouter";
import PartyMap from "components/templates/PartyMap";
import FriendShipPage from "pages/FriendShipPage";
import ArtPiece from "components/templates/ArtPiece";
import { ChatContextWrapper } from "components/context/ChatContext";
import { updateTheme } from "./helpers";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { useParams, useHistory } from "react-router-dom";
import { VenueTemplate } from "types/VenueTemplate";
import useConnectCurrentEvent from "hooks/useConnectCurrentEvent";
import { canUserJoinTheEvent, ONE_MINUTE_IN_SECONDS } from "utils/time";
import CountDown from "components/molecules/CountDown";
import { useUser } from "hooks/useUser";
import { hasUserBoughtTicketForEvent } from "utils/hasUserBoughtTicket";
import useConnectUserPurchaseHistory from "hooks/useConnectUserPurchaseHistory";
import { useSelector } from "hooks/useSelector";
import { isUserAMember } from "utils/isUserAMember";

import "./VenuePage.scss";

const VenuePage = () => {
  const { venueId } = useParams();
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
  }));

  const event = currentEvent?.[0];

  venue && updateTheme(venue);
  const hasUserBoughtTicket =
    event && hasUserBoughtTicketForEvent(userPurchaseHistory, event.id);

  const isEventFinished =
    event &&
    currentTimestamp >
    event.start_utc_seconds + event.duration_minutes * ONE_MINUTE_IN_SECONDS;

  const isUserVenueOwner = user && venue?.owners?.includes(user.uid);
  const isMember = isUserAMember(user.email, venue.config.memberEmails);

  const venueName = venue && venue.name;
  useUpdateLocationEffect(user, venueName);

  useConnectPartyGoers();
  useConnectCurrentVenue();
  useConnectCurrentEvent();
  useConnectUserPurchaseHistory();

  if (venueRequestStatus && !venue) {
    return <>This venue does not exist</>;
  }

  if (!isUserVenueOwner) {
    if (eventRequestStatus && !event) {
      return <>This event does not exist</>;
    }

    if (!event || !venue || !users || !userPurchaseHistoryRequestStatus) {
      return <>Loading...</>;
    }

    if (
      !isMember &&
      (event.price > 0 &&
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
    return <>Loading...</>;
  }

  if (!(profile?.partyName && profile?.pictureUrl)) {
    history.push(`/account/profile?venueId=${venueId}`);
  }

  let template;
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
    case VenueTemplate.artPiece:
      template = <ArtPiece />;
      break;
  }

  return (
    <ChatContextWrapper>
      {isUserVenueOwner && (
        <div className="preview-indication">This is a preview of an event</div>
      )}
      {template}
    </ChatContextWrapper>
  );
};

export default VenuePage;
