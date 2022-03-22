import React, { useCallback, useState } from "react";
import { Button, ButtonVariant } from "components/admin/Button";

import { isTruthy } from "utils/types";

import { Modal } from "components/molecules/Modal";

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
      <div className="flex flex-col items-center">
        {hasHeader && <h4>{header}</h4>}
        <div>{message}</div>
        <div className="mt-4">
          <Button onClick={cancel} variant="secondary">
            {cancelBtnLabel}
          </Button>
          <Button variant={confirmVariant} onClick={confirm}>
            {saveBtnLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
