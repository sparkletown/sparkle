import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";
import { DEFAULT_PARTY_JOIN_MESSAGE } from "settings";

import { AnyVenue } from "types/venues";

import { joinVenue } from "utils/url";

import "./VenueJoinModal.scss";

interface VenueJoinModalProps {
  venueId?: string;
  venue: AnyVenue;
  show: boolean;
  isLoggedIn: boolean;
  onHide?: () => void;
}

export const VenueJoinModal: React.FC<VenueJoinModalProps> = ({
  show,
  venueId,
  venue,
  isLoggedIn,
  onHide,
}) => {
  const handleJoinVenue = useCallback(() => {
    if (!venueId) return;

    joinVenue(venueId, { hasVenueEntrance: !!venue?.entrance?.length });
  }, [venue, venueId]);

  const hideModal = useCallback(() => {
    onHide && onHide();
  }, [onHide]);

  return (
    <Modal show={show} onHide={hideModal}>
      <Modal.Body>
        <div className="venue-join-modal__title">
          {isLoggedIn
            ? `You are now attending ${venue.name}`
            : DEFAULT_PARTY_JOIN_MESSAGE}
        </div>
        <button
          className="btn btn-primary btn-block btn-centered"
          onClick={handleJoinVenue}
        >
          {`Let's go`}
        </button>
      </Modal.Body>
    </Modal>
  );
};
