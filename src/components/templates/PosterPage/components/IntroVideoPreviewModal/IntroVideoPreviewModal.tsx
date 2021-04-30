import React from "react";
import Modal from "react-bootstrap/Modal";

import { PosterPageVenue } from "types/venues";

import { WithId } from "utils/id";

import "./IntroVideoPreviewModal.scss";

export interface IntroVideoPreviewModalProps {
  isVisible: boolean;
  onHide: () => void;
  posterVenue?: WithId<PosterPageVenue>;
}

export const IntroVideoPreviewModal: React.FC<IntroVideoPreviewModalProps> = ({
  isVisible,
  onHide,
  posterVenue,
}) => {
  return (
    <Modal
      show={isVisible}
      onHide={onHide}
      dialogClassName="IntroVideoPreviewModal"
      centered
      size="lg"
      modal
    >
      <iframe
        className="IntroVideoPreviewModal__iframe"
        title="IntroVideoPreviewModal-iframe"
        src={posterVenue?.poster?.introVideoUrl}
      />
    </Modal>
  );
};
