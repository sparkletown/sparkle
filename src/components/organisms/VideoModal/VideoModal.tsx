import React from "react";
import { Modal } from "react-bootstrap";

import { IFRAME_ALLOW } from "settings";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";

import "./VideoModal.scss";

interface PropsType {
  show: boolean;
  onHide: () => void;
  url: string;
  caption?: string;
  autoplay?: boolean;
  backdrop?: "static" | boolean | undefined;
}

const VideoModal: React.FunctionComponent<PropsType> = ({
  show,
  onHide,
  url,
  caption,
  autoplay = false,
  backdrop = "static",
}) => {
  const closeVideoModal = () => {
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={closeVideoModal}
      centered={true}
      size={"xl"}
      backdrop={backdrop}
    >
      <Modal.Header closeButton>
        {caption && <Modal.Title>{caption}</Modal.Title>}
      </Modal.Header>
      <div className="video-modal-container">
        <div className="content">
          <iframe
            className="youtube-video"
            title="art-piece-video"
            src={convertToEmbeddableUrl({ url, autoPlay: autoplay })}
            frameBorder="0"
            allow={IFRAME_ALLOW}
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </Modal>
  );
};

export default VideoModal;
