import React, { useCallback, useState } from "react";
import { Modal } from "react-bootstrap";

import { isTruthy } from "utils/types";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./ConfirmationModal.scss";

interface ConfirmationModalProps {
  show?: boolean;
  header?: string;
  message: string;
  no?: string;
  yes?: string;
  centered?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  show,
  header,
  message,
  no = "No",
  yes = "Yes",
  centered = true,
  onConfirm,
  onCancel,
}) => {
  const [isVisible, setIsVisible] = useState(true);

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

  const isShown = show !== undefined ? show : isVisible;

  return (
    <Modal
      className="ConfirmationModal"
      show={isShown}
      onHide={hide}
      centered={centered}
    >
      <Modal.Body>
        <div>
          {hasHeader && <Modal.Title>{header}</Modal.Title>}
          <div className="ConfirmationModal__message">{message}</div>
          <div className="ConfirmationModal__buttons">
            <ButtonNG onClick={cancel}>{no}</ButtonNG>
            <ButtonNG variant="primary" onClick={confirm}>
              {yes}
            </ButtonNG>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
