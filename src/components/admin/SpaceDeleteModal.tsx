import React from "react";
import { useAsyncFn } from "react-use";
import { Button } from "components/admin/Button";
import { FIREBASE } from "core/firebase";
import { httpsCallable } from "firebase/functions";

import { SPACE_TAXON } from "settings";

import { SpaceId } from "types/id";

import { Modal } from "components/molecules/Modal";
import { ModalTitle } from "components/molecules/Modal/ModalTitle";

import { LoadingSpinner } from "components/atoms/LoadingSpinner";

export interface SpaceDeleteModalProps {
  spaceId?: SpaceId;
  spaceName?: string;
  show: boolean;
  onHide?: () => void;
  onDelete?: () => void;
  onCancel: () => void;
}

export const SpaceDeleteModal: React.FunctionComponent<SpaceDeleteModalProps> = ({
  spaceId,
  spaceName,
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
      id: spaceId,
    });
    onDelete?.();
  }, [onDelete, spaceId]);

  return (
    <Modal show={show} onHide={onHide} centered bgVariant="dark">
      <div data-bem="SpaceDeleteModal">
        <ModalTitle>Delete {SPACE_TAXON.lower}</ModalTitle>

        <div className="secondary-action">
          WARNING: This action cannot be undone and will permanently remove the
          space <b>{spaceName}</b>!
        </div>

        {isDeleting && <LoadingSpinner />}

        <div>
          <Button disabled={isDeleting} variant="danger" onClick={deleteVenue}>
            Yes, Delete
          </Button>
          <Button disabled={isDeleting} variant="primary" onClick={onCancel}>
            No, Cancel
          </Button>
        </div>
        {error && <span className="input-error">{error}</span>}
      </div>
    </Modal>
  );
};
