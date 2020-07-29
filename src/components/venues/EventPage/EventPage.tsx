import React from "react";
import { useParams, Link, Redirect } from "react-router-dom";
import { updateTheme } from "pages/VenuePage/helpers";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import useConnectCurrentEvent from "hooks/useConnectCurrentEvent";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";

const EventPage = () => {
  const { venueId, eventId } = useParams();
  const { user } = useUser();
  const {
    venue,
    event,
    eventPurchase,
    eventPurchaseRequestStatus,
    venueRequestStatus,
    eventRequestStatus,
  } = useSelector((state) => ({
    eventPurchase: state.firestore.data.eventPurchase,
    venue: state.firestore.data.currentVenue,
    venueRequestStatus: state.firestore.status.requested.currentVenue,
    event: state.firestore.data.currentEvent,
    eventRequestStatus: state.firestore.status.requested.currentEvent,
    eventPurchaseRequestStatus: state.firestore.status.requested.eventPurchase,
  }));

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
