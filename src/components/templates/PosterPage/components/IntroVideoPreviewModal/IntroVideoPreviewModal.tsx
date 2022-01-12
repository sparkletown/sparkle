import React from "react";

import { IFRAME_ALLOW } from "settings";

import { Modal } from "components/molecules/Modal";

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
    <Modal isOpen={true} onClose={onHide} isCentered>
      <div className="IntroVideoPreviewModal">
        <iframe
          className="IntroVideoPreviewModal__iframe"
          title="IntroVideoPreviewModal-iframe"
          src={introVideoUrl}
          allow={IFRAME_ALLOW}
          allowFullScreen
        />
      </div>
    </Modal>
  );
};
