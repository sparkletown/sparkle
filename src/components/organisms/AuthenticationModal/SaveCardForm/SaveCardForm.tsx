import React, { useState } from "react";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import { useUser } from "hooks/useUser";
import CardInput from "components/molecules/CardInput";
import "../AuthenticationModal.scss";
import firebase from "firebase/app";

interface PropsType {
  closeAuthenticationModal: () => void;
}

const SaveCardForm: React.FunctionComponent<PropsType> = ({
  closeAuthenticationModal,
}) => {
  const elements = useElements();
  const { user } = useUser();
  const stripe = useStripe();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isFormBeingSubmitted, setIsFormBeingSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setIsFormBeingSubmitted(true);
    if (!stripe || !elements) {
      setErrorMessage("Oops something wrong happened");
      setIsFormBeingSubmitted(false);
      return;
    }
    const cardElement = elements.getElement(CardElement);
    if (cardElement) {
      const { error, paymentMethod } =
        cardElement &&
        (await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        }));

      if (error) {
        setErrorMessage(error.message);
      } else {
        await firebase
          .functions()
          .httpsCallable("payment-createCustomerWithPaymentMethod")({
          paymentMethodId: paymentMethod?.id || "",
        });
      }
    }
    setIsFormBeingSubmitted(false);
    closeAuthenticationModal();
  };

  return (
    <div className="form-container">
      <h2 className="centered">Attach a credit card to your account</h2>
      <form onSubmit={handleSubmit} className="save-card-form-container">
        <CardInput />
        <button
          disabled={!stripe}
          className="btn btn-primary btn-block confirm-order-button"
          type="submit"
        >
          {!isFormBeingSubmitted ? (
            "Save card"
          ) : (
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </button>
        <div className="red-text">{errorMessage}</div>
      </form>
      <div className="secondary-action">
        <span className="link" onClick={closeAuthenticationModal}>
          Skip
        </span>
      </div>
    </div>
  );
};

export default SaveCardForm;
