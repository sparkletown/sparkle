import React from "react";
import ReactModal from "react-modal";
import { useAsyncFn } from "react-use";
import firebase from "firebase/app";

import { ButtonNG } from "components/atoms/ButtonNG";
import { LoadingSpinner } from "components/atoms/LoadingSpinner";

import "./VenueDeleteModal.scss";

export interface VenueDeleteModalProps {
  venueId?: string;
  venueName?: string;
  show: boolean;
  onHide?: () => void;
  onDelete?: () => void;
  onCancel: () => void;
}

const VenueDeleteModal: React.FunctionComponent<VenueDeleteModalProps> = ({
  venueId,
  venueName,
  show,
  onHide,
  onDelete,
  onCancel,
}) => {
  const [{ error, loading: isDeleting }, deleteVenue] = useAsyncFn(async () => {
    await firebase.functions().httpsCallable("venue-deleteVenue")({
      id: venueId,
    });
    onDelete?.();
  }, [onDelete, venueId]);

  return (
    <ReactModal isOpen={show} onAfterClose={onHide}>
      <div className="VenueDeleteModal">
        <h2 className="centered">Delete space</h2>
        <div className="secondary-action">
          WARNING: This action cannot be undone and will permanently remove the
          space <b>{venueName}</b>!
        </div>

        {isDeleting && <LoadingSpinner />}

        <div className="VenueDeleteModal__buttons">
          <ButtonNG
            disabled={isDeleting}
            variant="danger"
            onClick={deleteVenue}
          >
            Yes, Delete
          </ButtonNG>
          <ButtonNG disabled={isDeleting} variant="primary" onClick={onCancel}>
            No, Cancel
          </ButtonNG>
        </div>
        {error && <span className="input-error">{error}</span>}
      </div>
    </ReactModal>
  );
};

export default VenueDeleteModal;
