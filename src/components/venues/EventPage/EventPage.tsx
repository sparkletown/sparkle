import React from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { updateTheme } from "pages/VenuePage/helpers";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import useConnectCurrentEvent from "hooks/useConnectCurrentEvent";

const EventPage = () => {
  const { venueId, eventId } = useParams();
  const { user, venue, event, eventPurchase } = useSelector((state: any) => ({
    user: state.user,
    eventPurchase: state.firestore.data.eventPurchase,
    venue: state.firestore.data.currentVenue,
    event: state.firestore.data.currentEvent,
  }));

  useConnectCurrentVenue();
  useConnectCurrentEvent();

  venue && updateTheme(venue);

  if (!user || !event || !eventPurchase) {
    return <>Loading...</>;
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
