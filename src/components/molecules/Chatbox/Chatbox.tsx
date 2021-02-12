import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import { MessageToDisplay } from "types/chat";

import { ChatMessage } from "components/atoms/ChatMessage";

import "./Chatbox.scss";

export type ChatboxProps = {
  messages: MessageToDisplay[];
  sendMessage: (text: string) => void;
  deleteMessage: (message: {}) => void;
};

export const Chatbox: React.FC<ChatboxProps> = ({
  messages,
  sendMessage,
  deleteMessage,
}) => {
  const onAuthorClick = () => {};

  const [isMessageBeingSent, setIsMessageBeingSent] = useState(false);

  useEffect(() => {
    if (isMessageBeingSent) {
      setTimeout(() => {
        setIsMessageBeingSent(false);
      }, 2000);
    }
  }, [isMessageBeingSent]);

  const { register, handleSubmit, reset } = useForm<{ message: string }>({
    mode: "onSubmit",
  });

  const onSubmit = handleSubmit(({ message }) => {
    setIsMessageBeingSent(true);
    sendMessage(message);
    reset();
  });

  const rendreredMessages = useMemo(
    () =>
      messages.map((message) => (
        <ChatMessage {...message} onAuthorClick={onAuthorClick} />
      )),
    [messages]
  );

  return (
    <div className="chatbox-container">
      <div className="chatbox-messages-container">{rendreredMessages}</div>
      <form className="chatbox-input-container" onSubmit={onSubmit}>
        <input
          className="chatbox-input"
          ref={register({ required: true })}
          name="message"
          placeholder="Type your message..."
        ></input>
        <button
          className="chatbox-input-button"
          type="submit"
          disabled={isMessageBeingSent}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className={classNames("chatbox-input-button_icon", {
              "chatbox-input-button_icon--active": true,
            })}
            size="lg"
          />
        </button>
      </form>
    </div>
  );
};
