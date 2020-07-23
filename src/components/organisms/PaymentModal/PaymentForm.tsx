import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CardSection from "./CardSection";
import firebase from "firebase/app";
import "firebase/functions";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { VenueEvent } from "types/VenueEvent";

interface PropsType {
  setIsPaymentSuccess: (value: boolean) => void;
  setIsFormBeingSubmitted: (value: boolean) => void;
  isFormBeingSubmitted: boolean;
  event: VenueEvent;
}

const PaymentForm: React.FunctionComponent<PropsType> = ({
  setIsPaymentSuccess,
  setIsFormBeingSubmitted,
  isFormBeingSubmitted,
  event,
}) => {
  const { venueId } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const { user } = useSelector((state: any) => ({
    user: state.user,
  }));

  const [billingEmail, setBillingEmail] = useState(user.email);

  useEffect(() => {
    async function getPaymentIntent() {
      const { client_secret: clientSecretToken } = (
        await firebase.functions().httpsCallable("payment-createPaymentIntent")(
          {
            venueId: venueId,
            eventId: event.id,
            price: event.price,
            userEmail: user.email,
            userId: user.uid,
          }
        )
      ).data;
      setClientSecret(clientSecretToken);
    }
    try {
      getPaymentIntent();
    } catch {
      setErrorMessage("Could not create a payment intent");
    }
  }, [event.id, venueId, event.price, user.uid, user.email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsFormBeingSubmitted(true);
    e.preventDefault();
    if (!stripe || !elements) {
      setErrorMessage("Oops something wrong happened");
      return;
    }
    const result = await stripe.confirmCardPayment(clientSecret || "", {
      payment_method: {
        card: elements.getElement(CardElement) || { token: "" },
        billing_details: {
          email: user.email,
        },
      },
      receipt_email: user.email,
    });

    if (result.error) {
      setErrorMessage(result.error.message);
    } else {
      if (result.paymentIntent?.status === "succeeded") {
        setIsPaymentSuccess(true);
      }
    }
    setIsFormBeingSubmitted(false);
  };

  if (!clientSecret) {
    return <>Loading...</>;
  }

  return (
    <>
      <div className="price">{`£${event.price / 100}`}</div>
      <form onSubmit={handleSubmit} className="payment-form-container">
        <input
          value={billingEmail}
          onChange={(event) => setBillingEmail(event.target.value)}
          className=""
        />
        <CardSection />
        <button
          disabled={!stripe || isFormBeingSubmitted}
          className="btn btn-primary btn-block confirm-order-button"
          type="submit"
        >
          {!isFormBeingSubmitted ? (
            "Confirm order"
          ) : (
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </button>
        <div className="red-text">{errorMessage}</div>
      </form>
    </>
  );
};

export default PaymentForm;
