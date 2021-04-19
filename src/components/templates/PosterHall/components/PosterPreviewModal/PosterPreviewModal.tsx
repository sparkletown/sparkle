import React, { useCallback } from "react";
import Modal from "react-bootstrap/Modal";

import { PosterVenue } from "types/venues";

import { WithId } from "utils/id";
import { enterVenue } from "utils/url";

import "./PosterPreviewModal.scss";

export interface PosterPreviewModalProps {
  isVisible: boolean;
  onHide: () => void;
  posterVenue?: WithId<PosterVenue>;
}

export const PosterPreviewModal: React.FC<PosterPreviewModalProps> = ({
  isVisible,
  onHide,
  posterVenue,
}) => {
  return (
    <Modal
      show={isVisible}
      onHide={onHide}
      dialogClassName="poster-preview-modal"
      centered
      size="lg"
      modal
    >
      {posterVenue && <PosterPreviewModalContent posterVenue={posterVenue} />}
    </Modal>
  );
};

interface PosterPreviewModalContentProps {
  posterVenue: WithId<PosterVenue>;
}

const PosterPreviewModalContent: React.FC<PosterPreviewModalContentProps> = ({
  posterVenue,
}) => {
  const enterPosterVenue = useCallback(() => enterVenue(posterVenue.id), [
    posterVenue.id,
  ]);

  return (
    <>
      <p className="poster-preview-modal__title">{posterVenue.title}</p>
      <iframe
        className="poster-preview-modal__iframe"
        title="poster-preview-modal-iframe"
        src={posterVenue.introVideoUrl}
      />
      <button
        className="poster-preview-modal__button"
        onClick={enterPosterVenue}
      >
        Enter the poster page
      </button>
    </>
  );
};
