import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";

import { AnyVenue } from "types/venues";

import { joinVenue } from "utils/url";

import "./JoinVenueModal.scss";

interface JoinVenueModalProps {
  venueId?: string;
  venue: AnyVenue;
  show: boolean;
  isLoggedIn: boolean;
  onHide?: () => void;
}

export const JoinVenueModal: React.FC<JoinVenueModalProps> = ({
  show,
  venueId,
  venue,
  isLoggedIn,
  onHide,
}) => {
  const handleJoinVenue = useCallback(() => {
    joinVenue(venueId, venue.entrance ? !!venue.entrance.length : false);
  }, [venue.entrance, venueId]);

  const hideModal = useCallback(() => {
    onHide && onHide();
  }, [onHide]);

  return (
    <Modal show={show} onHide={hideModal}>
      <Modal.Body>
        <>
          <div className="join-venue-title">
            {isLoggedIn
              ? `You are now attending ${venue.name}`
              : "You need an account to join this party"}
          </div>
          <button
            className="btn btn-primary btn-block btn-centered"
            onClick={handleJoinVenue}
          >
            {`Let's go`}
          </button>
        </>
      </Modal.Body>
    </Modal>
  );
};
