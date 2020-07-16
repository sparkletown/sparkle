import React from "react";
import { useSelector } from "react-redux";
import "bootstrap";
import qs from "qs";

import LockedSite from "./LockedSite";
import { PARTY_NAME } from "./config";
import { leaveRoom } from "utils/useLocationUpdateEffect";
import VenueRouter from "components/venues/VenueRouter";

import { loadStripe } from "@stripe/stripe-js";
import { useFirebase } from "react-redux-firebase";
import { useLocation } from "react-router-dom";
import { STRIPE_PUBLISHABLE_KEY } from "secrets";

const ONE_HOUR_IN_SECONDS = 60 * 60;

function isAfterEvent(startUtcSeconds, durationMinutes) {
  const endUtcSeconds = startUtcSeconds + durationMinutes * 60;
  const lockSiteAfterUtcSeconds = endUtcSeconds + 12 * ONE_HOUR_IN_SECONDS;
  return new Date() / 1000 >= lockSiteAfterUtcSeconds;
}

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

function StripeTest() {
  const firebase = useFirebase();
  let location = useLocation();

  console.log(location);

  const handleClick = async (event) => {
    const { session_id: sessionId } = (
      await firebase.functions().httpsCallable("payment-getSessionId")({
        venueId: "fftf",
        eventId: 2345,
        returnUrl: window.location.href,
      })
    ).data;

    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
  };
  return (
    <button role="link" onClick={handleClick}>
      Checkout
    </button>
  );
}

export default function App(props) {
  const { config, user } = useSelector((state) => ({
    config:
      state.firestore.data.config && state.firestore.data.config[PARTY_NAME],
    user: state.user,
  }));

  window.onbeforeunload = () => {
    if (user) {
      leaveRoom(user);
    }
  };

  const search = qs.parse(props.location.search, { ignoreQueryPrefix: true });
  const unlock = search.unlock !== undefined;

  return <StripeTest />;

  if (!config) {
    return "Loading...";
  }

  if (
    !unlock &&
    isAfterEvent(config.start_utc_seconds, config.duration_minutes)
  ) {
    return <LockedSite />;
  }

  return <VenueRouter />;
}
