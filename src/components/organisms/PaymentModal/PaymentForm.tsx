import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CardInput from "components/molecules/CardInput";
import firebase from "firebase/app";
import "firebase/functions";
import { useParams } from "react-router-dom";
import { VenueEvent } from "types/VenueEvent";
import TabNavigation from "components/molecules/TabNavigation";
import { PAYMENT_FORM_TAB_ARRAY, INDIVIDUAL_TICKET_TAB } from "./constants";
import { useUser } from "hooks/useUser";

interface PropsType {
  setIsPaymentSuccess: (value: boolean) => void;
  setIsPaymentProceeding: (value: boolean) => void;
  setIsCardBeingSaved: (value: boolean) => void;
  isPaymentProceeding: boolean;
  isCardBeingSaved: boolean;
  event: VenueEvent;
}

const PaymentForm: React.FunctionComponent<PropsType> = ({
  setIsPaymentSuccess,
  setIsPaymentProceeding,
  isPaymentProceeding,
  event,
  isCardBeingSaved,
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

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    setIsLoading: (isLoading: boolean) => void,
    operations: () => Promise<void>
  ) => {
    if (!user) return;
    setIsLoading(true);
    e.preventDefault();
    if (!stripe || !elements) {
      setErrorMessage("Oops something wrong happened");
      setIsLoading(false);
      return;
    }
    await operations();
    setIsLoading(false);
  };

  const pay = async () => {
    if (!(user.email && clientSecret)) {
      setErrorMessage("Oops something wrong happened");
      return;
    }
    const result = await stripe?.confirmCardPayment(clientSecret || "", {
      payment_method: {
        card: elements?.getElement(CardElement) || { token: "" },
        billing_details: {
          email: user?.email ?? undefined,
        },
      },
      receipt_email: user?.email ?? undefined,
    });

    if (result?.error) {
      setErrorMessage(result?.error.message);
    } else {
      if (result?.paymentIntent?.status === "succeeded") {
        setIsPaymentSuccess(true);
      }
    }
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
        <form className="payment-form-container">
          <input
            value={billingEmail ?? undefined}
            onChange={(event) => setBillingEmail(event.target.value)}
            className=""
          />
          <CardInput />
          <div className="button-container">
            <button
              disabled={!stripe || isPaymentProceeding || isCardBeingSaved}
              className="btn btn-primary btn-block submit-button"
              type="submit"
            >
              {!isCardBeingSaved ? (
                "Save card and pay"
              ) : (
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              )}
            </button>
            <button
              disabled={!stripe || isPaymentProceeding || isCardBeingSaved}
              className="btn btn-primary btn-block submit-button"
              type="submit"
              onClick={(e) => handleSubmit(e, setIsPaymentProceeding, pay)}
            >
              {!isPaymentProceeding ? (
                "Pay"
              ) : (
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              )}
            </button>
          </div>
          <div className="red-text">{errorMessage}</div>
        </form>
      )}
    </>
  );
};

export default PaymentForm;
