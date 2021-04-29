import React from "react";
import Modal from "react-bootstrap/Modal";

import { PosterVenue } from "types/venues";

import { WithId } from "utils/id";

import "./IntroVideoPreviewModal.scss";

export interface IntroVideoPreviewModalProps {
  isVisible: boolean;
  onHide: () => void;
  posterVenue?: WithId<PosterVenue>;
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
      {posterVenue && (
        <IntroVideoPreviewModalContent posterVenue={posterVenue} />
      )}
    </Modal>
  );
};

export interface IntroVideoPreviewModalContentProps {
  posterVenue: WithId<PosterVenue>;
}

export const IntroVideoPreviewModalContent: React.FC<IntroVideoPreviewModalContentProps> = ({
  posterVenue,
}) => {
  return (
    <>
      <p className="IntroVideoPreviewModal__title">{posterVenue.title}</p>
      <iframe
        className="IntroVideoPreviewModal__iframe"
        title="IntroVideoPreviewModal-iframe"
        src={posterVenue.introVideoUrl}
      />
    </>
  );
};
