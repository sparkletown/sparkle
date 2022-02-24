import React, { useCallback, useState } from "react";

import { isTruthy } from "utils/types";

import { ButtonNG } from "components/atoms/ButtonNG";
import { ButtonVariant } from "components/atoms/ButtonNG/ButtonNG";
import { Modal } from "components/molecules/Modal";

import "./ConfirmationModal.scss";

interface ConfirmationModalProps {
  show?: boolean;
  header?: string;
  message: string;
  confirmVariant?: ButtonVariant;
  cancelBtnLabel?: string;
  saveBtnLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  show,
  header,
  message,
  onConfirm,
  onCancel,
  cancelBtnLabel = "No",
  saveBtnLabel = "Yes",
  confirmVariant = "primary",
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
    <Modal show={isShown} onHide={hide}>
      <div className="ConfirmationModal">
        {hasHeader && <h4>{header}</h4>}
        <div className="ConfirmationModal__message">{message}</div>
        <div className="ConfirmationModal__buttons">
          <ButtonNG onClick={cancel}>{cancelBtnLabel}</ButtonNG>
          <ButtonNG variant={confirmVariant} onClick={confirm}>
            {saveBtnLabel}
          </ButtonNG>
        </div>
      </div>
    </Modal>
  );
};
