import React from "react";
import "firebase/functions";
import "./EventPaymentButton.scss";
import useConnectUserPurchaseHistory from "hooks/useConnectUserPurchaseHistory";
import { useSelector } from "react-redux";
import { Purchase } from "types/Purchase";
import { Link } from "react-router-dom";
import { hasUserBoughtTicketForEvent } from "utils/hasUserBoughtTicket";

interface PropsType {
  eventId: string;
  venueId: string;
  setIsPaymentModalOpen: (value: boolean) => void;
  selectEvent: () => void;
}

const EventPaymentButton: React.FunctionComponent<PropsType> = ({
  eventId,
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
    eventId
  );

  const handleClick = () => {
    selectEvent();
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="event-payment-button-container">
      {hasUserAlreadyBoughtTicket ? (
        <Link to={`/venue/${venueId}/event/${eventId}`}>
          <button role="link" className="btn btn-primary buy-tickets-button">
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
