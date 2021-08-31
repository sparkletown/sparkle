import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { CHAT_MESSAGE_TIMEOUT } from "settings";

import { User } from "types/User";

import { WithId } from "utils/id";

import { useJukeboxChat } from "hooks/jukebox";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { ButtonNG } from "components/atoms/ButtonNG";
import { InputField } from "components/atoms/InputField";

import "./Jukebox.scss";

type JukeboxTypeProps = {
  recentVenueUsers: readonly WithId<User>[];
};
const Jukebox: React.FC<JukeboxTypeProps> = ({ recentVenueUsers }) => {
  const { register, handleSubmit, watch, reset } = useForm<{
    message: string;
  }>({
    mode: "onSubmit",
  });
  const [isSendingMessage, setMessageSending] = useState(false);
  const messages = [
    "John H added “What a wonderful night” to the queue",
    "John H added “What a wonderful night” to the queue",
    "John H added “What a wonderful night” to the queue",
  ];
  const chatValue = watch("message");
  const venueId = useVenueId();
  const { userId } = useUser();
  const [filteredUser] = recentVenueUsers.filter(
    (vUser) => vUser.id === userId
  );
  console.log(venueId, filteredUser);
  const tableName = filteredUser?.data[venueId]?.table;
  console.log(tableName);
  const { sendJukeboxMsg } = useJukeboxChat(venueId);

  const sendMessageToChat = handleSubmit(({ message }) => {
    const url = message;
    setMessageSending(true);
    sendJukeboxMsg({ message, url });
    reset();
  });

  // This logic disallows users to spam into the chat. There should be a delay, between each message
  useEffect(() => {
    if (!isSendingMessage) return;

    const timeoutId = setTimeout(() => {
      setMessageSending(false);
    }, CHAT_MESSAGE_TIMEOUT);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isSendingMessage]);

  return (
    <div className="Jukebox__container">
      <div className="Jukebox__chat">
        {messages.map((msg, index) => (
          <span key={`${msg}${index}`} className="Jukebox__chat-messages">
            {msg}
          </span>
        ))}
      </div>
      <form className="Jukebox__form" onSubmit={sendMessageToChat}>
        <InputField
          containerClassName="Jukebox__input-container"
          inputClassName="Jukebox__input"
          ref={register({ required: true })}
          name="message"
          placeholder="Add a link to the queue (YouTube, Vimeo, Twitch etc.)"
          autoComplete="off"
        />

        <div className="Jukebox__buttons">
          <ButtonNG
            aria-label="Send message"
            className="Jukebox__buttons-submit"
            type="submit"
            disabled={!chatValue || isSendingMessage}
            variant="primary"
            iconOnly={true}
            iconSize="1x"
          />
        </div>
      </form>
    </div>
  );
};

export default Jukebox;
