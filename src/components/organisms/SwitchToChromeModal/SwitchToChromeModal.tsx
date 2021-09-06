import React from "react";
import { Modal } from "react-bootstrap";

import { DOWNLOAD_CHROME_URL } from "settings";

import { getExtraLinkProps } from "utils/url";

import { Button } from "components/atoms/Button";

import "./SwitchToChromeModal.scss";

interface SwitchToChromeModalProps {
  show: boolean;
  onHide: () => void;
}

export const SwitchToChromeModal: React.FC<SwitchToChromeModalProps> = ({
  show,
  onHide,
}) => {
  return (
    <Modal show={show} onHide={onHide} className="SwitchToChromeModal">
      <p className="SwitchToChromeModal__text">
        For the best Sparkle experience, we recommend Google Chrome
      </p>
      <a href={DOWNLOAD_CHROME_URL} {...getExtraLinkProps(true)}>
        <Button customClass="SwitchToChromeModal__download">
          Download Google Chrome
        </Button>
      </a>
    </Modal>
  );
};
