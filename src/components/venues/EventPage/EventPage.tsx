import React from "react";
import { useSelector } from "react-redux";
import { useParams, Link, Redirect } from "react-router-dom";
import { updateTheme } from "pages/VenuePage/helpers";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import useConnectCurrentEvent from "hooks/useConnectCurrentEvent";
import { Purchase } from "types/Purchase";
import { Venue } from "types/Venue";
import { VenueEvent } from "types/VenueEvent";
import { User as FUser } from "firebase/app";

const EventPage = () => {
  const { venueId, eventId } = useParams();
  const {
    user,
    venue,
    event,
    eventPurchase,
    eventPurchaseRequestStatus,
    venueRequestStatus,
    eventRequestStatus,
  } = useSelector((state: any) => ({
    user: state.user,
    eventPurchase: state.firestore.data.eventPurchase,
    venue: state.firestore.data.currentVenue,
    venueRequestStatus: state.firestore.status.requested.currentVenue,
    event: state.firestore.data.currentEvent,
    eventRequestStatus: state.firestore.status.requested.currentEvent,
    eventPurchaseRequestStatus: state.firestore.status.requested.eventPurchase,
  })) as {
    user: FUser;
    eventPurchase: Purchase;
    venue: Venue;
    venueRequestStatus: boolean;
    event: VenueEvent;
    eventRequestStatus: boolean;
    eventPurchaseRequestStatus: boolean;
  };

  useConnectCurrentVenue();
  useConnectCurrentEvent();

  venue && updateTheme(venue);

  if (!user || !event || !eventPurchase || !venue) {
    return <>Loading...</>;
  }

  if (venueRequestStatus && !venue) {
    return <>This venue does not exist</>;
  }

  if (eventRequestStatus && !event) {
    return <>This event does not exist</>;
  }

  if (eventPurchaseRequestStatus && !eventPurchase) {
    return <>Forbidden</>;
  }

  if (!user) {
    return <Redirect to={`/venue/${venueId}`} />;
  }

  return (
    <>
      <div>EventPage</div>
      <Link to={`/venue/${venueId}/event/${eventId}`}>
        <button className="btn btn-primary">Join the event</button>
      </Link>
    </>
  );
};

export default EventPage;
