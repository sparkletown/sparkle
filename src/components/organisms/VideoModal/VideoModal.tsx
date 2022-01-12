import React from "react";

import { IFRAME_ALLOW } from "settings";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";

import { Modal } from "components/molecules/Modal";

import PortalCloseIcon from "assets/icons/icon-close-portal.svg";

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
}) => {
  const closeVideoModal = () => {
    onHide();
  };

  return (
    <Modal isOpen={show} onClose={closeVideoModal} fullWidth>
      <div className="VideoModal">
        {caption && <h3>{caption}</h3>}
        <div className="VideoModal__content">
          <iframe
            className="VideoModal__youtube"
            title="art-piece-video"
            src={convertToEmbeddableUrl({ url, autoPlay: autoplay })}
            frameBorder="0"
            allow={IFRAME_ALLOW}
            allowFullScreen
          ></iframe>
        </div>

        <img
          className="VideoModal__close-icon"
          src={PortalCloseIcon}
          alt="close portal"
          onClick={onHide}
        />
      </div>
    </Modal>
  );
};

export default VideoModal;
