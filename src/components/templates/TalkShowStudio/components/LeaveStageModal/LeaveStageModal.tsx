import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";

import AppButton from "../../../../atoms/Button";

import "./LeaveStageModal.scss";

interface LeaveStageModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: () => void;
  userNameToRemove?: string;
}

export const LeaveStageModal: React.FC<LeaveStageModalProps> = ({
  show,
  onHide,
  onSubmit,
  userNameToRemove,
}) => {
  const onRemove = useCallback(() => {
    onSubmit();
    onHide();
  }, [onSubmit, onHide]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="LeaveStageModal"
      centered
    >
      <Modal.Body>
        <div className="LeaveStageModal__content">
          <p className="LeaveStageModal__label">{`Are you sure you want to ${
            userNameToRemove ? `remove ${userNameToRemove} from` : "leave"
          } the stage?`}</p>
          <div className="LeaveStageModal__buttons">
            <AppButton
              customClass={"LeaveStageModal__cancelButton"}
              onClick={onHide}
            >
              Cancel
            </AppButton>
            <AppButton
              customClass={"LeaveStageModal__removeButton"}
              onClick={onRemove}
            >
              {userNameToRemove ? "Remove user" : "Leave stage"}
            </AppButton>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
