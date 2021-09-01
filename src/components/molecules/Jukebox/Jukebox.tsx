import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";

import { CHAT_MESSAGE_TIMEOUT, IFRAME_ALLOW } from "settings";

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
  defaultIframe: string;
  iframeUrl: string;
  seatedAtTable: string;
  updateIframeUrl: Dispatch<SetStateAction<string>>;
};
const Jukebox: React.FC<JukeboxTypeProps> = ({
  recentVenueUsers,
  iframeUrl,
  seatedAtTable,
  updateIframeUrl,
}) => {
  const { register, handleSubmit, watch, reset } = useForm<{
    jukeboxMessage: string;
  }>({
    mode: "onSubmit",
  });
  const [isSendingMessage, setMessageSending] = useState(false);
  const chatValue = watch("jukeboxMessage");
  // const chatValue = true;
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
      if (lastMessage?.text?.includes("embed")) {
        updateIframeUrl(lastMessage.text);
        return;
      }

      updateIframeUrl(iframeUrl);
    }
  }, [messagesToDisplay, updateIframeUrl, iframeUrl]);

  const sendMessageToChat = handleSubmit(({ jukeboxMessage }) => {
    const url = jukeboxMessage;
    setMessageSending(true);
    sendJukeboxMsg({ message: jukeboxMessage, url });
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

  if (!seatedAtTable) {
    return null;
  }

  return (
    <>
      {iframeUrl ? (
        <div className="iframe-container">
          <iframe
            key="main-event"
            title="main event"
            className="iframe-video"
            src={`${iframeUrl}?autoplay=1`}
            frameBorder="0"
            allow={IFRAME_ALLOW}
          />
        </div>
      ) : (
        <div className="iframe-video">Embedded Video URL not yet set up</div>
      )}
      <div className="Jukebox__container">
        <div className="Jukebox__chat">
          {filteredMessages.map((msg, index) => (
            <span key={`${msg}${index}`} className="Jukebox__chat-messages">
              Message: {msg.text}
            </span>
          ))}
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
              iconOnly={true}
              iconSize="1x"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default Jukebox;
