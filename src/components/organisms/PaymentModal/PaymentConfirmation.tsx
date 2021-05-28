import React from "react";
import { CountDown } from "components/molecules/CountDown";

interface PropsType {
  startUtcSeconds: number;
}

const PaymentConfirmation: React.FunctionComponent<PropsType> = ({
  startUtcSeconds,
}) => (
  <div className="payment-confirmation-container">
    <h3>Congratulations!</h3>
    <p>
      {`You have purchased your ticket for Saturday's gig`}
      <br />
      We look forward to seeing you in the bar on Saturday.
    </p>
    <CountDown startUtcSeconds={startUtcSeconds} />
  </div>
);

export default PaymentConfirmation;
