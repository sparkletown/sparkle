import React, { FC } from "react";
import { Modal } from "react-bootstrap";

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

const VideoErrorModal: FC<PropsType> = ({
  show,
  errorMessage,
  onHide,
  onBack,
  onRetry,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            padding: 20,
          }}
        >
          {errorMessages[errorMessage] ??
            "Unknown video error, please try again."}
        </div>

        <div>
          <button className="btn btn-block btn-centered" onClick={onRetry}>
            Retry
          </button>
          <button className="btn btn-block btn-centered" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default VideoErrorModal;
