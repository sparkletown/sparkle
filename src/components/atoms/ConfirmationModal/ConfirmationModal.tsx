import React, { FC, useCallback, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { isTruthy } from "utils/types";

import "./ConfirmationModal.scss";

interface ConfirmationModalProps {
  show?: boolean;
  header?: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
  show,
  header,
  message,
  onConfirm,
  onCancel,
}) => {
  const [isVisible, setIsVisible] = useState(show ?? true);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  const confirm = useCallback(() => {
    onConfirm();
    hide();
  }, [onConfirm, hide]);

  const cancel = useCallback(async () => {
    onCancel && (await onCancel());
    hide();
  }, [onCancel, hide]);

  const hasHeader = isTruthy(header);

  return (
    <Modal show={isVisible} onHide={hide}>
      <Modal.Body>
        <div className="confirmation-modal">
          {hasHeader && <h2 className="confirm-header">{header}</h2>}
          <div className="confirm-message">{message}</div>
          <div className="confirmation-buttons">
            <Button className="cancel-button" onClick={cancel}>
              No
            </Button>
            <Button className="confirm-button" onClick={confirm}>
              Yes
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
