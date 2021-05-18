import React from "react";
import "firebase/functions";
import { Link } from "react-router-dom";

import { VenueEvent } from "types/venues";

import { hasUserBoughtTicketForEvent } from "utils/hasUserBoughtTicket";
import { isUserAMember } from "utils/isUserAMember";
import { isEventStartingSoon } from "utils/event";
import { WithId } from "utils/id";
import { venueEntranceUrl } from "utils/url";
import {
  currentVenueSelectorData,
  userPurchaseHistorySelector,
} from "utils/selectors";

import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import useConnectUserPurchaseHistory from "hooks/useConnectUserPurchaseHistory";

import "./EventPaymentButton.scss";

interface PropsType {
  event: WithId<VenueEvent>;
  venueId: string;
  setIsPaymentModalOpen: (value: boolean) => void;
  selectEvent: () => void;
  paymentConfirmationPending: boolean;
  isUserVenueOwner: boolean;
}

const EventPaymentButton: React.FunctionComponent<PropsType> = ({
  event,
  venueId,
  setIsPaymentModalOpen,
  selectEvent,
  paymentConfirmationPending,
  isUserVenueOwner,
}) => {
  useConnectUserPurchaseHistory();
  const { user } = useUser();

  const venue = useSelector(currentVenueSelectorData);
  const purchaseHistory = useSelector(userPurchaseHistorySelector);

  const hasUserAlreadyBoughtTicket =
    hasUserBoughtTicketForEvent(purchaseHistory, event.id) ||
    (user && isUserAMember(user.email, venue?.config?.memberEmails));

  const handleClick = () => {
    selectEvent();
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="event-payment-button-container">
      {hasUserAlreadyBoughtTicket || isUserVenueOwner ? (
        <Link to={venueEntranceUrl(venueId)}>
          <button
            role="link"
            className="btn btn-primary buy-tickets-button"
            disabled={isEventStartingSoon(event)}
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
            disabled={paymentConfirmationPending}
          >
            {paymentConfirmationPending ? (
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              "Buy tickets"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default EventPaymentButton;
