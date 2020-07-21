import React, { useState } from "react";
import useConnectUserPurchaseHistory from "hooks/useConnectUserPurchaseHistory";
import { useSelector } from "react-redux";
import { Purchase } from "types/Purchase";
import openStripeCheckout from "utils/openStripeCheckout";
import { Redirect } from "react-router-dom";
import { ParsedQs } from "qs";
import { hasUserBoughtTicketForEvent } from "utils/hasUserBoughtTicket";

interface PropsType {
  venueId: string | string[] | ParsedQs | ParsedQs[];
  eventId: string | string[] | ParsedQs | ParsedQs[];
}

const CheckPaymentIsNeeded: React.FunctionComponent<PropsType> = ({
  venueId,
  eventId,
}) => {
  useConnectUserPurchaseHistory();
  const [isStripeCheckoutLoading, setIsStripeCheckoutLoading] = useState(false);
  const [stripeError, setStripeError] = useState<string | undefined>();
  const { purchaseHistory, purchaseHistoryRequestStatus } = useSelector(
    (state: any) => ({
      purchaseHistory: state.firestore.ordered.userPurchaseHistory,
      purchaseHistoryRequestStatus:
        state.firestore.status.requested.userPurchaseHistory,
    })
  ) as { purchaseHistory: Purchase[]; purchaseHistoryRequestStatus: boolean };
  const hasUserBoughtTicket =
    purchaseHistory && hasUserBoughtTicketForEvent(purchaseHistory, eventId);

  if (!purchaseHistoryRequestStatus || isStripeCheckoutLoading) {
    return <>Loading...</>;
  }
  if (!hasUserBoughtTicket) {
    openStripeCheckout(
      eventId,
      venueId,
      setIsStripeCheckoutLoading,
      setStripeError
    );
    return <>{stripeError || "Loading..."}</>;
  }
  return <Redirect to={`/venue/${venueId}`} />;
};

export default CheckPaymentIsNeeded;
