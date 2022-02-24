import React, { FC } from "react";

import { ButtonNG } from "components/atoms/ButtonNG";
import { Modal } from "components/molecules/Modal";

import "./VideoErrorModal.scss";

interface PropsType {
  show: boolean;
  errorMessage: string;
  onHide: () => void;
  onBack: () => void;
  onRetry: () => void;
}

const NO_DEVICE_ERROR = "Requested device not found";
const START_DEVICE_ERROR = "Could not start video source";

const errorMessages: { [key: string]: string } = {
  [NO_DEVICE_ERROR]:
    "No video device found, please make sure your camera is working.",
  [START_DEVICE_ERROR]:
    "There was a problem with the camera, please try again.",
};

export const VideoErrorModal: FC<PropsType> = ({
  show,
  errorMessage,
  onHide,
  onBack,
  onRetry,
}) => (
  <Modal show={show} onHide={onHide} autoHide closeButton>
    <div className="VideoErrorModal">
      <div className="VideoErrorModal__title">
        {errorMessage &&
          (errorMessages[errorMessage] ??
            "Please ALLOW camera & microphone access in your browser settings in order to join the table. Click Allow when prompted.")}
      </div>

      <div className="VideoErrorModal__buttons">
        <ButtonNG onClick={onRetry}>Retry</ButtonNG>
        <ButtonNG onClick={onBack}>Back</ButtonNG>
      </div>
    </div>
  </Modal>
);
