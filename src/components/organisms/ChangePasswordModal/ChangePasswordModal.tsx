import React from "react";
import { Modal } from "react-bootstrap";

interface PropsType {
  show: boolean;
  onHide: () => void;
}

const ChangePasswordModal: React.FunctionComponent<PropsType> = ({
  show,
  onHide,
}) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Body>Hello World</Modal.Body>
  </Modal>
);

export default ChangePasswordModal;
