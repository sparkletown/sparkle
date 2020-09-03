import React from "react";
import "./GiftTicketModal.scss";

interface PropsType {}

export const GiftTicketModal: React.FunctionComponent<PropsType> = () => {
  return (
    <div className="gift_ticket-modal-container">
      <div className="gift_ticket-title">Gift a ticket</div>
      <div className="gift_ticket-text">
        Invite that awesome friend, make the Burn twice as good!
      </div>
      <a
        href={
          "https://www.eventbrite.com/e/sparkleverse-2020-online-burn-tickets-117154948605"
        }
        target={"_blank"}
        rel={"noopener noreferrer"}
        className={"btn button btn-primary"}
      >
        Gift a ticket
      </a>
    </div>
  );
};
