import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";

import { User } from "types/User";

import { WithId } from "utils/id";

import AppButton from "components/atoms/Button";

import "./LeaveStageModal.scss";

interface LeaveStageModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (user?: WithId<User>) => void;
  userToRemove?: WithId<User>;
}

export const LeaveStageModal: React.FC<LeaveStageModalProps> = ({
  show,
  onHide,
  onSubmit,
  userToRemove,
}) => {
  const onRemove = useCallback(() => {
    onSubmit(userToRemove);
    onHide();
  }, [onSubmit, onHide, userToRemove]);

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
            userToRemove?.partyName
              ? `remove ${userToRemove.partyName} from`
              : "leave"
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
              {userToRemove?.partyName ? "Remove user" : "Leave stage"}
            </AppButton>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
