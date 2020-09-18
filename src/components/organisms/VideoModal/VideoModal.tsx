import React from "react";
import { Modal } from "react-bootstrap";
import "./VideoModal.scss";
import { ConvertToEmbeddableUrl } from "utils/ConvertToEmbeddableUrl";

interface PropsType {
  show: boolean;
  onHide: () => void;
  url: string;
}

const VideoModal: React.FunctionComponent<PropsType> = ({
  show,
  onHide,
  url,
}) => {
  const closeVideoModal = () => {
    onHide();
  };

  return (
    <Modal show={show} onHide={closeVideoModal}>
      <div className="video-modal-container">
        <div className="content">
          <iframe
            className="youtube-video"
            title="art-piece-video"
            src={ConvertToEmbeddableUrl(url)}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </Modal>
  );
};

export default VideoModal;
