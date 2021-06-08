import React from "react";
import { Modal } from "react-bootstrap";
import "./VideoModal.scss";
import { ConvertToEmbeddableUrl } from "utils/ConvertToEmbeddableUrl";
import { IFRAME_ALLOW } from "settings";

interface PropsType {
  show: boolean;
  onHide: () => void;
  url: string;
  caption?: string;
  autoplay?: boolean;
}

const VideoModal: React.FunctionComponent<PropsType> = ({
  show,
  onHide,
  url,
  caption,
  autoplay = false,
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
      backdrop="static"
    >
      <Modal.Header closeButton>
        {caption && <Modal.Title>{caption}</Modal.Title>}
      </Modal.Header>
      <div className="video-modal-container">
        <div className="content">
          <iframe
            className="youtube-video"
            title="art-piece-video"
            src={ConvertToEmbeddableUrl(url, autoplay)}
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
