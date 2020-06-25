import React from "react";
import Chatbox from "components/organisms/Chatbox";

interface PropsType {
  show: boolean;
  room?: string;
}

const ChatModal: React.FunctionComponent<PropsType> = ({ show, room }) => (
  <div
    className="chat-modal"
    style={{ display: `${!show ? "none" : "block"}` }}
  >
    <Chatbox room={room} />
  </div>
);

export default ChatModal;
