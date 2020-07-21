import { loadStripe } from "@stripe/stripe-js";
import firebase from "firebase/app";
import "firebase/functions";
import { STRIPE_PUBLISHABLE_KEY } from "secrets";
import { ParsedQs } from "qs";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const openStripeCheckout = async (
  eventId: string | ParsedQs | ParsedQs[] | string[],
  venueId: string | ParsedQs | ParsedQs[] | string[],
  setIsLoading: (value: boolean) => void,
  setStripeError: (value: string | undefined) => void
) => {
  setIsLoading(true);
  setStripeError(undefined);
  try {
    const { session_id: sessionId } = (
      await firebase.functions().httpsCallable("payment-getSessionId")({
        venueId: venueId,
        eventId: eventId,
        returnUrl: `${window.location.protocol}//${window.location.host}/venue/${venueId}`,
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

export default openStripeCheckout;
