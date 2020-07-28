import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CardSection from "./CardSection";
import firebase from "firebase/app";
import "firebase/functions";
import { useParams } from "react-router-dom";
import { VenueEvent } from "types/VenueEvent";
import TabNavigation from "components/molecules/TabNavigation";
import { PAYMENT_FORM_TAB_ARRAY, INDIVIDUAL_TICKET_TAB } from "./constants";
import { useUser } from "hooks/useUser";

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
  const [selectedTab, setSelectedTab] = useState(INDIVIDUAL_TICKET_TAB.id);
  const { venueId } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const { user } = useUser();

  const ticketPrice =
    selectedTab === INDIVIDUAL_TICKET_TAB.id
      ? event.price
      : event.collective_price;

  const [billingEmail, setBillingEmail] = useState(user?.email);

  useEffect(() => {
    setClientSecret(undefined);
    async function getPaymentIntent() {
      if (!user) return;
      const { client_secret: clientSecretToken } = (
        await firebase.functions().httpsCallable("payment-createPaymentIntent")(
          {
            venueId: venueId,
            eventId: event.id,
            price: ticketPrice,
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
  }, [event.id, venueId, ticketPrice, user, selectedTab]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!user) return;
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
          email: user.email ?? undefined,
        },
      },
      receipt_email: user.email ?? undefined,
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

  return (
    <>
      <div className="price">{`£${ticketPrice / 100}`}</div>
      <TabNavigation
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        tabsArray={PAYMENT_FORM_TAB_ARRAY}
      />
      {!clientSecret ? (
        <>Loading...</>
      ) : (
        <form onSubmit={handleSubmit} className="payment-form-container">
          <input
            value={billingEmail ?? undefined}
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
      )}
    </>
  );
};

export default PaymentForm;
