import React from "react";
import { useAsyncFn } from "react-use";
import { FIREBASE } from "core/firebase";
import { httpsCallable } from "firebase/functions";

import { SPACE_TAXON } from "settings";

import { ButtonNG } from "components/atoms/ButtonNG";
import { LoadingSpinner } from "components/atoms/LoadingSpinner";
import { Modal } from "components/molecules/Modal";

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
    await httpsCallable(
      FIREBASE.functions,
      "venue-deleteVenue"
    )({
      id: venueId,
    });
    onDelete?.();
  }, [onDelete, venueId]);

  return (
    <Modal show={show} onHide={onHide} centered bgVariant="dark">
      <div className="VenueDeleteModal">
        <h2 className="centered">Delete {SPACE_TAXON.lower}</h2>
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
    </Modal>
  );
};

export default VenueDeleteModal;
