import React from "react";
import ReactModal from "react-modal";

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
    <ReactModal
      isOpen={isVisible}
      onAfterClose={onHide}
      className="IntroVideoPreviewModal"
    >
      <iframe
        className="IntroVideoPreviewModal__iframe"
        title="IntroVideoPreviewModal-iframe"
        src={introVideoUrl}
        allow={IFRAME_ALLOW}
        allowFullScreen
      />
    </ReactModal>
  );
};
