import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useFirebase } from "react-redux-firebase";
import "firebase/functions";
import { STRIPE_PUBLISHABLE_KEY } from "secrets";
import { VenueEvent } from "types/VenueEvent";
import { useSelector } from "react-redux";
import { Venue } from "pages/VenuePage/VenuePage";
import "./EventPaymentButton.scss";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface PropsType {
  event: VenueEvent;
}

const EventPaymentButton: React.FunctionComponent<PropsType> = ({ event }) => {
  const firebase = useFirebase();
  const { venue } = useSelector((state: any) => ({
    venue: state.firestore.ordered.currentVenue[0],
  })) as { venue: Venue };
  const [isLoading, setIsLoading] = useState(false);
  const [stripeError, setStripeError] = useState<string | undefined>();

  const handleClick = async (event: VenueEvent) => {
    setIsLoading(true);
    setStripeError(undefined);
    try {
      const {
        session_id: sessionId,
      } = (
        // @ts-ignore firebase.functions() exists
        await firebase.functions().httpsCallable("payment-getSessionId")({
          venueId: venue.id,
          eventId: event.id,
          returnUrl: `${window.location.protocol}//${window.location.host}/venue/${venue.id}/entrance/${event.id}`,
        })
      ).data;

      const stripe = await stripePromise;

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId,
        });

        if (!error) {
          return;
        }

        setStripeError(error.message);
      }
    } catch (e) {
      setStripeError("Oops, something wrong happened");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="event-payment-button-container">
      <button
        role="link"
        className="btn btn-primary buy-tickets-button"
        disabled={isLoading}
        onClick={() => (!isLoading ? handleClick(event) : null)}
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
