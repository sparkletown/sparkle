import React, { useCallback, useState } from "react";
import ReactModal from "react-modal";

import { isTruthy } from "utils/types";

import { ButtonNG } from "components/atoms/ButtonNG";
import { ButtonVariant } from "components/atoms/ButtonNG/ButtonNG";

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
    <ReactModal
      className="ConfirmationModal"
      isOpen={isShown}
      onAfterClose={hide}
    >
      <div>
        {hasHeader && <h4>{header}</h4>}
        <div className="ConfirmationModal__message">{message}</div>
        <div className="ConfirmationModal__buttons">
          <ButtonNG onClick={cancel}>{cancelBtnLabel}</ButtonNG>
          <ButtonNG variant={confirmVariant} onClick={confirm}>
            {saveBtnLabel}
          </ButtonNG>
        </div>
      </div>
    </ReactModal>
  );
};
