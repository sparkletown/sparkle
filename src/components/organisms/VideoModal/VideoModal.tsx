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
  backdrop?: "static" | boolean | undefined;
}

export const VideoModal: React.FunctionComponent<PropsType> = ({
  show,
  onHide,
  url,
  caption,
  autoplay = false,
}) => (
  <Modal show={show} onHide={onHide} wide>
    <div className="VideoModal">
      {caption && <div className="VideoModal__title">{caption}</div>}
      <div className="VideoModal__content">
        <iframe
          className="VideoModal__youtube"
          title="art-piece-video"
          src={convertToEmbeddableUrl({ url, autoPlay: autoplay })}
          frameBorder="0"
          allow={IFRAME_ALLOW}
          allowFullScreen
        />
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
