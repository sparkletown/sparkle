import React from "react";
import { Modal } from "react-bootstrap";
import Button from "../Button/Button";
import "./LeaveStageModal.scss";

interface LeaveStageModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: () => void;
}

const LeaveStageModal = ({ show, onHide, onSubmit }: LeaveStageModalProps) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="leave-stage-modal-container"
      centered
    >
      <Modal.Body>
        <div className="leave-stage-modal">
          <p className="label">Are you sure you want to leave the stage?</p>
          <div className="buttons">
            <Button onClick={onHide} variant="secondary" small>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSubmit();
                onHide();
              }}
              small
            >
              Leave stage
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LeaveStageModal;
