import React from "react";
import ReactModal from "react-modal";

import { IFRAME_ALLOW } from "settings";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";

import "./VideoModal.scss";

interface PropsType {
  show: boolean;
  onHide: () => void;
  url: string;
  caption?: string;
  autoplay?: boolean;
  backdrop?: string | boolean;
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
    <ReactModal isOpen={show} onAfterClose={closeVideoModal}>
      <h2>{caption && <span>{caption}</span>}</h2>
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
    </ReactModal>
  );
};

export default VideoModal;
