import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { VenueEvent } from "types/VenueEvent";
import useConnectUserPurchaseHistory from "hooks/useConnectUserPurchaseHistory";
import { useSelector } from "react-redux";
import { hasUserBoughtTicketForEvent } from "utils/hasUserBoughtTicket";
import { Purchase } from "types/Purchase";
import "./PaymentModal.scss";
import PaymentForm from "./PaymentForm";

interface PropsType {
  show: boolean;
  onHide: () => void;
  selectedEvent: VenueEvent;
}

const PaymentModal: React.FunctionComponent<PropsType> = ({
  show,
  onHide,
  selectedEvent,
}) => {
  useConnectUserPurchaseHistory();
  const { purchaseHistory, purchaseHistoryRequestStatus } = useSelector(
    (state: any) => ({
      purchaseHistory: state.firestore.ordered.userPurchaseHistory,
      purchaseHistoryRequestStatus:
        state.firestore.status.requested.userPurchaseHistory,
    })
  ) as { purchaseHistory: Purchase[]; purchaseHistoryRequestStatus: boolean };
  const hasUserBoughtTicket =
    purchaseHistory &&
    hasUserBoughtTicketForEvent(purchaseHistory, selectedEvent.id);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isFormBeingSubmitted, setIsFormBeingSubmitted] = useState(false);

  const closePaymentModal = () => {
    if (!isFormBeingSubmitted) {
      onHide();
    }
  };

  let modalContent;
  if (!purchaseHistoryRequestStatus) {
    modalContent = <>Loading...</>;
  } else if (isPaymentSuccess) {
    modalContent = (
      <>Thank you, your payment was confirmed. See you at the party!</>
    );
  } else if (!hasUserBoughtTicket) {
    modalContent = (
      <PaymentForm
        setIsPaymentSuccess={setIsPaymentSuccess}
        setIsFormBeingSubmitted={setIsFormBeingSubmitted}
        isFormBeingSubmitted={isFormBeingSubmitted}
        event={selectedEvent}
      />
    );
  } else {
    modalContent = <>You have already paid for this event</>;
  }

  return (
    <Modal show={show} onHide={closePaymentModal}>
      <div className="payment-modal-container">
        <div className="header">
          <div className="title event-title">{selectedEvent.name}</div>
        </div>
        {modalContent}
      </div>
    </Modal>
  );
};

export default PaymentModal;
