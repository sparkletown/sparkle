import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CardInput from "components/molecules/CardInput";
import firebase from "firebase/app";
import "firebase/functions";
import { VenueEvent } from "types/VenueEvent";
import TabNavigation from "components/molecules/TabNavigation";
import { PAYMENT_FORM_TAB_ARRAY, INDIVIDUAL_TICKET_TAB } from "./constants";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
import { Stripe, StripeElements } from "@stripe/stripe-js";
import { WithId } from "utils/id";

interface PropsType {
  setIsPaymentSuccess: (value: boolean) => void;
  setIsPaymentProceeding: (value: boolean) => void;
  setIsCardBeingSaved: (value: boolean) => void;
  isPaymentProceeding: boolean;
  isCardBeingSaved: boolean;
  event: WithId<VenueEvent>;
}

const PaymentForm: React.FunctionComponent<PropsType> = ({
  setIsPaymentSuccess,
  setIsPaymentProceeding,
  isPaymentProceeding,
  event,
  isCardBeingSaved,
  setIsCardBeingSaved,
}) => {
  const [selectedTab, setSelectedTab] = useState(INDIVIDUAL_TICKET_TAB.id);
  const venueId = useVenueId();
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [paymentIntentId, setPaymentIntentId] = useState<string | undefined>();
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
      const {
        client_secret: clientSecretToken,
        payment_intent_id: newPaymentIntentId,
      } = (
        await firebase.functions().httpsCallable("payment-createPaymentIntent")(
          {
            venueId: venueId,
            eventId: event.id,
          }
        )
      ).data;
      setClientSecret(clientSecretToken);
      setPaymentIntentId(newPaymentIntentId);
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
    operations: (stripe: Stripe, elements: StripeElements) => Promise<void>
  ) => {
    if (!user) return;
    setIsLoading(true);
    e.preventDefault();
    if (!stripe || !elements) {
      setErrorMessage("Oops something wrong happened");
      setIsLoading(false);
      return;
    }
    await operations(stripe, elements);
    setIsLoading(false);
  };

  const handlePayment = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
    handleSubmit(e, setIsPaymentProceeding, pay);
  const handleSaveCard = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
    handleSubmit(e, setIsCardBeingSaved, saveCardAndPay);

  const pay = async (stripe: Stripe, elements: StripeElements) => {
    if (!(user?.email && clientSecret)) {
      setErrorMessage("Oops something wrong happened");
      return;
    }
    await firebase
      .functions()
      .httpsCallable("payment-setPaymentIntentProcessing")({
      paymentIntentId,
    });
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement) || { token: "" },
        billing_details: {
          email: user.email,
        },
      },
      receipt_email: user.email,
    });

    if (result.paymentIntent?.status === "succeeded") {
      setIsPaymentSuccess(true);
      await firebase.functions().httpsCallable("payment-confirmPaymentIntent")({
        paymentIntentId: result.paymentIntent.id,
      });
    } else {
      setErrorMessage(
        result.error?.message || "Payment didn't work, try again"
      );
      await firebase
        .functions()
        .httpsCallable("payment-setPaymentIntentFailed")({
        paymentIntentId,
      });
    }
  };

  const saveCardAndPay = async (stripe: Stripe, elements: StripeElements) => {
    const cardElement = elements.getElement(CardElement);
    if (cardElement && stripe) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (paymentMethod) {
        const result = (
          await firebase
            .functions()
            .httpsCallable("payment-createCustomerWithPaymentMethod")({
            paymentMethodId: paymentMethod.id,
          })
        ).data;
        if (result.error) {
          setErrorMessage(result.error.raw.message);
        } else {
          await pay(stripe, elements);
        }
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
              onClick={handleSaveCard}
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
              onClick={handlePayment}
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
