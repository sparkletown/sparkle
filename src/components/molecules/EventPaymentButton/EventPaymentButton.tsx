import React from "react";
import "firebase/functions";
import "./EventPaymentButton.scss";
import useConnectUserPurchaseHistory from "hooks/useConnectUserPurchaseHistory";
import { useSelector } from "react-redux";
import { Purchase } from "types/Purchase";
import { Link } from "react-router-dom";
import { hasUserBoughtTicketForEvent } from "utils/hasUserBoughtTicket";
import { canUserJoinTheEvent } from "utils/time";
import { VenueEvent } from "types/VenueEvent";

interface PropsType {
  event: VenueEvent;
  venueId: string;
  setIsPaymentModalOpen: (value: boolean) => void;
  selectEvent: () => void;
}

const EventPaymentButton: React.FunctionComponent<PropsType> = ({
  event,
  venueId,
  setIsPaymentModalOpen,
  selectEvent,
}) => {
  useConnectUserPurchaseHistory();
  const { purchaseHistory } = useSelector((state: any) => ({
    purchaseHistory: state.firestore.ordered.userPurchaseHistory,
  })) as { purchaseHistory: Purchase[] };

  const hasUserAlreadyBoughtTicket = hasUserBoughtTicketForEvent(
    purchaseHistory,
    event.id
  );

  const handleClick = () => {
    selectEvent();
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="event-payment-button-container">
      {hasUserAlreadyBoughtTicket ? (
        <Link to={`/venue/${venueId}/event/${event.id}`}>
          <button
            role="link"
            className="btn btn-primary buy-tickets-button"
            disabled={!canUserJoinTheEvent(event)}
          >
            Join the event
          </button>
        </Link>
      ) : (
        <div>
          <button
            role="link"
            className="btn btn-primary buy-tickets-button"
            onClick={handleClick}
          >
            Buy tickets
          </button>
        </div>
      )}
    </div>
  );
};

export default EventPaymentButton;
