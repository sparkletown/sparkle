import React from "react";
import { Modal } from "react-bootstrap";
import "./PdfModal.scss";
import { IFRAME_ALLOW } from "settings";

interface PropsType {
  show: boolean;
  onHide: () => void;
  url: string;
  caption?: string;
}

export const PdfModal: React.FunctionComponent<PropsType> = ({
  show,
  onHide,
  url,
  caption,
}) => {
  const closePdfModal = () => {
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={closePdfModal}
      centered={true}
      size={"xl"}
      backdrop={true}
    >
      <Modal.Header closeButton>
        {caption && <Modal.Title>{caption}</Modal.Title>}
      </Modal.Header>
      <div className="pdf-modal-container">
        <div className="content">
          <iframe
            className="pdf"
            title="pdf"
            src={url}
            frameBorder="0"
            allow={IFRAME_ALLOW}
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </Modal>
  );
};
