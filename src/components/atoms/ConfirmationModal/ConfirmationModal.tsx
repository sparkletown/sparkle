import React, { useCallback, useState } from "react";
import { Modal } from "react-bootstrap";

import { isTruthy } from "utils/types";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./ConfirmationModal.scss";

interface ConfirmationModalProps {
  show?: boolean;
  header?: string;
  message: string;
  cancelBtnLabel?: string;
  saveBtnLabel?: string;
  centered?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
  isCentered?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  show,
  header,
  message,
  onConfirm,
  onCancel,
  cancelBtnLabel = "No",
  saveBtnLabel = "Yes",
  isCentered = false,
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
    <Modal show={isShown} onHide={hide} centered={isCentered}>
      <Modal.Body>
        <div className="ConfirmationModal">
          {hasHeader && <h4>{header}</h4>}
          <div className="ConfirmationModal__message">{message}</div>
          <div className="ConfirmationModal__buttons">
            <ButtonNG onClick={cancel}>{cancelBtnLabel}</ButtonNG>
            <ButtonNG variant="danger" onClick={confirm}>
              {saveBtnLabel}
            </ButtonNG>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
