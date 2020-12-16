import React, { FC, Fragment, useCallback } from "react";
import { Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import { AnyVenue } from "types/Firestore";
import { venueEntranceUrl, venueInsideUrl } from "utils/url";

import "./JoinVenueModal.scss";

interface JoinVenueModal {
  venueId?: string;
  venue: AnyVenue;
  show: boolean;
  isLoggedIn: boolean;
  onHide: () => void;
}

export const JoinVenueModal: FC<JoinVenueModal> = ({
  show,
  venueId,
  venue,
  isLoggedIn,
  onHide,
}) => {
  const history = useHistory();

  const joinVenue = useCallback(() => {
    if (venueId) {
      const venueEntrance = venue?.entrance && venue.entrance.length;

      const url = !venueEntrance
        ? venueInsideUrl(venueId)
        : venueEntranceUrl(venueId);
      history.push(url);
    }
  }, [history, venue, venueId]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Body>
        <Fragment>
          <div className="join-venue-title">
            {isLoggedIn
              ? `You are now attending ${venue.name}`
              : "You need an account to join this party"}
          </div>
          <button
            className="btn btn-primary btn-block btn-centered"
            onClick={joinVenue}
          >
            {`Let's go`}
          </button>
        </Fragment>
      </Modal.Body>
    </Modal>
  );
};
