import React from "react";
import Modal from "react-bootstrap/Modal";

import { IFRAME_ALLOW } from "settings";

import "./IntroVideoPreviewModal.scss";

export interface IntroVideoPreviewModalProps {
  isVisible: boolean;
  onHide: () => void;
  introVideoUrl: string;
}

export const IntroVideoPreviewModal: React.FC<IntroVideoPreviewModalProps> = ({
  isVisible,
  onHide,
  introVideoUrl,
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
        src={introVideoUrl}
        allow={IFRAME_ALLOW}
        allowFullScreen
      />
    </Modal>
  );
};
