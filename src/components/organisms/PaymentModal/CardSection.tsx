import React from "react";
import { CardElement } from "@stripe/react-stripe-js";
import "./CardSectionStyles.scss";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "white",
      fontSmoothing: "antialiased",
      fontSize: "16px",
    },
  },
};

function CardSection() {
  return <CardElement options={CARD_ELEMENT_OPTIONS} />;
}

export default CardSection;
