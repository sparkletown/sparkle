import React from "react";
import { Modal } from "react-bootstrap";
import Chatbox from "components/organisms/Chatbox";

interface PropsType {
  show: boolean;
  onHide: () => void;
  room?: string;
}

const ChatModal: React.FunctionComponent<PropsType> = ({
  show,
  onHide,
  room,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      backdropClassName="chat-backdrop"
      dialogClassName="chat-modal"
    >
      <Modal.Body>
        <Chatbox room={room} />
      </Modal.Body>
    </Modal>
  );
};

export default ChatModal;
