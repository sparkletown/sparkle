import React, { useState } from "react";
import "firebase/functions";
import "./EventPaymentButton.scss";
import openStripeCheckout from "utils/openStripeCheckout";
import useConnectUserPurchaseHistory from "hooks/useConnectUserPurchaseHistory";
import { useSelector } from "react-redux";
import { Purchase } from "types/Purchase";
import { Link } from "react-router-dom";

interface PropsType {
  eventId: string;
  venueId: string;
}

const EventPaymentButton: React.FunctionComponent<PropsType> = ({
  eventId,
  venueId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [stripeError, setStripeError] = useState<string | undefined>();

  useConnectUserPurchaseHistory();
  const { purchaseHistory } = useSelector((state: any) => ({
    purchaseHistory: state.firestore.ordered.userPurchaseHistory,
  })) as { purchaseHistory: Purchase[] };

  const hasUserAlreadyBoughtTicket =
    purchaseHistory &&
    purchaseHistory.find((purchase) => purchase.eventId === eventId);

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
            disabled={isLoading}
            onClick={() =>
              !isLoading
                ? openStripeCheckout(
                    eventId,
                    venueId,
                    setIsLoading,
                    setStripeError
                  )
                : null
            }
          >
            {isLoading ? (
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              "Buy tickets"
            )}
          </button>
          {stripeError && <p className="red-text">{stripeError}</p>}
        </div>
      )}
    </div>
  );
};

export default EventPaymentButton;
