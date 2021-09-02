import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";

import { CHAT_MESSAGE_TIMEOUT, YOUTUBE_SHORT_URL_STRING } from "settings";

import { User } from "types/User";

import { WithId } from "utils/id";
import { getYoutubeEmbedFromUrl, isStringAValidUrl } from "utils/url";

import { useJukeboxChat } from "hooks/jukebox";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { ButtonNG } from "components/atoms/ButtonNG";
import { InputField } from "components/atoms/InputField";

import "./Jukebox.scss";

type JukeboxTypeProps = {
  recentVenueUsers: readonly WithId<User>[];
  updateIframeUrl: Dispatch<SetStateAction<string>>;
};
const Jukebox: React.FC<JukeboxTypeProps> = ({
  recentVenueUsers,
  updateIframeUrl,
}) => {
  const { register, handleSubmit, watch, reset } = useForm<{
    jukeboxMessage: string;
  }>({
    mode: "onSubmit",
  });
  const [isSendingMessage, setMessageSending] = useState(false);
  const chatValue = watch("jukeboxMessage");
  const venueId = useVenueId();
  const { userId } = useUser();
  const [filteredUser] =
    recentVenueUsers.filter((vUser) => vUser.id === userId) || [];
  const tableName = venueId ? filteredUser?.data?.[venueId].table ?? "" : "";

  const { sendJukeboxMsg, messagesToDisplay } = useJukeboxChat({
    venueId,
    tableId: tableName,
  });

  const filteredMessages = messagesToDisplay.filter(
    (msg) => msg.tableId === tableName
  );

  useEffect(() => {
    if (messagesToDisplay.length) {
      const [lastMessage] = messagesToDisplay;
      if (lastMessage?.text?.includes(YOUTUBE_SHORT_URL_STRING)) {
        const youtubeUrl = getYoutubeEmbedFromUrl(lastMessage?.text);
        updateIframeUrl(youtubeUrl);
        return;
      }
      if (isStringAValidUrl(lastMessage?.text)) {
        updateIframeUrl(lastMessage.text);
        return;
      }
      return;
    }
  }, [messagesToDisplay, updateIframeUrl]);

  const sendMessageToChat = handleSubmit(({ jukeboxMessage }) => {
    setMessageSending(true);

    sendJukeboxMsg({ message: jukeboxMessage });
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

  const isBtnDisabled = !chatValue || isSendingMessage;
  const submitButtonClasses = classNames("Jukebox__buttons-submit", {
    "Jukebox__buttons-submit--active": !isBtnDisabled,
  });

  return (
    <>
      <div className="Jukebox__container">
        <div className="Jukebox__chat">
          <span className="Jukebox__chat-messages">
            When you paste a link here, it changes what people see in the box
            above. Be respectful!
          </span>
          {filteredMessages?.map((msg, index) => {
            const msgAuthorName = msg.isMine
              ? `${msg.author.partyName} (I)`
              : msg.author.partyName;
            return (
              <span key={`${msg}${index}`} className="Jukebox__chat-messages">
                {msgAuthorName} changed video source to {msg.text}
              </span>
            );
          })}
        </div>
        <form className="Jukebox__form" onSubmit={sendMessageToChat}>
          <InputField
            containerClassName="Jukebox__input-container"
            inputClassName="Jukebox__input"
            ref={register({ required: true })}
            name="jukeboxMessage"
            placeholder="Add a link to the queue (YouTube, Vimeo, Twitch etc.)"
            autoComplete="off"
          />

          <div className="Jukebox__buttons">
            <ButtonNG
              aria-label="Send message"
              className={submitButtonClasses}
              type="submit"
              disabled={isBtnDisabled}
              variant="primary"
              iconOnly
              iconSize="1x"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default Jukebox;
