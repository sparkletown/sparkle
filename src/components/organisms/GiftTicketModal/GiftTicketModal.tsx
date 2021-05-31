import React from "react";

import { GIFT_TICKET_MODAL_URL } from "settings";

import { externalUrlAdditionalProps } from "utils/url";

import "./GiftTicketModal.scss";

export const GiftTicketModal: React.FC = () => {
  return (
    <div className="gift_ticket-modal-container">
      <div className="gift_ticket-title">Gift a ticket</div>
      <div className="gift_ticket-text">
        Invite that awesome friend, make the Burn twice as good!
      </div>
      <a
        className="btn button btn-primary"
        href={GIFT_TICKET_MODAL_URL}
        {...externalUrlAdditionalProps}
      >
        Gift a ticket
      </a>
    </div>
  );
};
