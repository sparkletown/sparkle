import React, { useState } from "react";
import "firebase/functions";
import "./EventPaymentButton.scss";
import openStripeCheckout from "utils/openStripeCheckout";

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

  return (
    <div className="event-payment-button-container">
      <button
        role="link"
        className="btn btn-primary buy-tickets-button"
        disabled={isLoading}
        onClick={() =>
          !isLoading
            ? openStripeCheckout(eventId, venueId, setIsLoading, setStripeError)
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
  );
};

export default EventPaymentButton;
