import React from "react";
import "firebase/functions";
import "./EventPaymentButton.scss";
import useConnectUserPurchaseHistory from "hooks/useConnectUserPurchaseHistory";
import { Link } from "react-router-dom";
import { hasUserBoughtTicketForEvent } from "utils/hasUserBoughtTicket";
import { isUserAMember } from "utils/isUserAMember";
import { canUserJoinTheEvent } from "utils/time";
import { VenueEvent } from "types/VenueEvent";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";

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
  const { user } = useUser();
  const { purchaseHistory, venue } = useSelector((state) => ({
    purchaseHistory: state.firestore.ordered.userPurchaseHistory,
    venue: state.firestore.data.currentVenue,
  }));

  const hasUserAlreadyBoughtTicket =
    hasUserBoughtTicketForEvent(purchaseHistory, event.id) ||
    (user && isUserAMember(user.email, venue.config.memberEmails));

  const handleClick = () => {
    selectEvent();
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="event-payment-button-container">
      {hasUserAlreadyBoughtTicket ? (
        <Link to={`/v/${venueId}/live`}>
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
