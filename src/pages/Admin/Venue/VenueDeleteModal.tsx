import React, { useState, useCallback } from "react";
import firebase from "firebase/app";
import { Modal } from "react-bootstrap";
import { WithId } from "utils/id";
import { Venue } from "types/venues";

import "./VenueDeleteModal.scss";
import { useHistory } from "react-router-dom";

interface PropsType {
  venue: WithId<Venue>;
  show: boolean;
  onHide: () => void;
}

const VenueDeleteModal: React.FunctionComponent<PropsType> = ({
  venue,
  show,
  onHide,
}) => {
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState<string>();
  const history = useHistory();

  const closeDeleteModal = () => {
    if (deleted) {
      history.push("/admin");
    } else {
      onHide();
      setDeleted(false);
    }
  };

  const deleteVenue = useCallback(async () => {
    setDeleting(true);
    try {
      await firebase.functions().httpsCallable("venue-deleteVenue")({
        id: venue.id,
      });
      setDeleted(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setDeleting(false);
    }
  }, [venue.id]);

  return (
    <Modal show={show} onHide={closeDeleteModal}>
      <div className="venue-delete-modal-container">
        <h2 className="centered">Delete venue</h2>
        <div className="secondary-action">
          WARNING: Permanently removes a venue from SparkleVerse
        </div>
        {!deleted && (
          <>
            <div className="input-group">
              <span className="info">
                WARNING: This action cannot be undone! Are you sure you wish to
                delete {venue.name}?
              </span>
            </div>
            {deleting && (
              <div className="centered-flex" style={{ marginBottom: 10 }}>
                <div className="spinner-border">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
            <div className="input-group">
              <button
                disabled={deleting}
                className="btn btn-danger btn-block btn-centered"
                onClick={deleteVenue}
              >
                Yes, Delete
              </button>
              {error && <span className="input-error">{error}</span>}
              <button
                disabled={deleting}
                className="btn btn-primary btn-block btn-centered"
                onClick={closeDeleteModal}
              >
                No, Cancel
              </button>
            </div>
          </>
        )}
        {deleted && (
          <div className="input-group">
            <span className="info">Venue has been permanently deleted.</span>
            <button
              className="btn btn-primary btn-block btn-centered"
              type="submit"
              onClick={closeDeleteModal}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default VenueDeleteModal;
