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
  containerClassName?: string;
  headerClassName?: string;
  messageClassName?: string;
  buttonsContainerClassName?: string;
  buttonClassName?: string;
  cancelButtonClassName?: string;
  isCentered?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  show,
  header,
  message,
  centered = true,
  onConfirm,
  onCancel,
  cancelBtnLabel = "No",
  saveBtnLabel = "Yes",
  containerClassName = "",
  headerClassName = "",
  messageClassName = "",
  buttonsContainerClassName = "",
  buttonClassName = "",
  cancelButtonClassName = "",
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

  const containerClasses = `ConfirmationModal ${containerClassName}`;
  const headerClasses = `ConfirmationModal__header ${headerClassName}`;
  const messageClasses = `ConfirmationModal__message ${messageClassName}`;
  const buttonsContainerClasses = `ConfirmationModal__buttons ${buttonsContainerClassName}`;
  const buttonClasses = `ConfirmationModal__button-confirm ${buttonClassName}`;
  const cancelButtonClasses = `ConfirmationModal__button-cancel ${cancelButtonClassName}`;

  const isShown = show !== undefined ? show : isVisible;

  return (
    <Modal show={isShown} onHide={hide} centered={isCentered}>
      <Modal.Body>
        <div className={containerClasses}>
          {hasHeader && <h2 className={headerClasses}>{header}</h2>}
          <div className={messageClasses}>{message}</div>
          <div className={buttonsContainerClasses}>
            <ButtonNG className={cancelButtonClasses} onClick={cancel}>
              {cancelBtnLabel}
            </ButtonNG>
            <ButtonNG className={buttonClasses} onClick={confirm}>
              {saveBtnLabel}
            </ButtonNG>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
