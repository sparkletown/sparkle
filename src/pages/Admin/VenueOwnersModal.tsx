import React from "react";
import { Modal } from "react-bootstrap";

interface VenueOwnersModalProps {
  visible: boolean;
  onHide?: () => void;
}

export const VenueOwnersModal: React.FC<VenueOwnersModalProps> = (props) => {
  const { visible, onHide } = props;

  return (
    <Modal show={visible} onHide={onHide}>
      <Modal.Body>
        <div className="modal-container"></div>
      </Modal.Body>
    </Modal>
  );
};
