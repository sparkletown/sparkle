import React, { FC, useCallback, useState } from "react";
import { Modal } from "react-bootstrap";

import { ButtonNG } from "components/atoms/ButtonNG";

import { DivRF } from "../DivRF";

import "./ConfirmationModalRF.scss";

interface ConfirmationModalRfProps {
  show?: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const ConfirmationModalRF: FC<ConfirmationModalRfProps> = ({
  show,
  title,
  message,
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

  const isShown = show !== undefined ? show : isVisible;

  return (
    <Modal show={isShown} onHide={hide} className="ConfirmationModalRF">
      <Modal.Title>
        <DivRF variant="title">{title}</DivRF>
      </Modal.Title>
      <Modal.Body>
        <DivRF className="mod--flex-col">
          <DivRF>{message}</DivRF>
        </DivRF>
      </Modal.Body>
      <Modal.Footer>
        <DivRF className="mod--flex-row mod--width-100pp">
          <ButtonNG onClick={cancel}>No</ButtonNG>
          <ButtonNG variant="primary" onClick={confirm}>
            Yes
          </ButtonNG>
        </DivRF>
      </Modal.Footer>
    </Modal>
  );
};
