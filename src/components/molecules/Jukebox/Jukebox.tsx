import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";

import { CHAT_MESSAGE_TIMEOUT, YOUTUBE_SHORT_URL_STRING } from "settings";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { getYoutubeEmbedFromUrl, isValidUrl } from "utils/url";

import { useJukeboxChat } from "hooks/jukebox";
import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useUser } from "hooks/useUser";

import { ButtonNG } from "components/atoms/ButtonNG";
import { InputField } from "components/atoms/InputField";

import "./Jukebox.scss";

type JukeboxTypeProps = {
  updateIframeUrl: Dispatch<SetStateAction<string>>;
  venue: WithId<AnyVenue>;
};

export const Jukebox: React.FC<JukeboxTypeProps> = ({
  updateIframeUrl,
  venue,
}) => {
  const { register, handleSubmit, watch, reset } = useForm<{
    jukeboxMessage: string;
  }>({
    mode: "onSubmit",
  });
  const [isSendingMessage, setMessageSending] = useState(false);
  const chatValue = watch("jukeboxMessage");
  const { userWithId } = useUser();
  const tableRef = userWithId?.data?.[venue.name]?.table;

  const { sendJukeboxMsg, messagesToDisplay } = useJukeboxChat({
    venueId: venue.id,
    tableId: tableRef,
  });
  const filteredMessages = messagesToDisplay.filter(
    ({ tableId }) => tableId === tableRef
  );

  useEffect(() => {
    const [lastMessage] = messagesToDisplay.slice(-1);
    let urlToEmbed = lastMessage?.text;

    if (
      urlToEmbed?.includes(YOUTUBE_SHORT_URL_STRING) &&
      isValidUrl(urlToEmbed)
    ) {
      urlToEmbed = getYoutubeEmbedFromUrl(lastMessage?.text);
    }

    if (isValidUrl(urlToEmbed)) {
      updateIframeUrl(urlToEmbed);
    }
  }, [messagesToDisplay, updateIframeUrl]);

  const sendMessageToChat = handleSubmit(async ({ jukeboxMessage }) => {
    setMessageSending(true);

    await sendJukeboxMsg({ message: jukeboxMessage });
    reset();
  });

  // @debt replace with useDebounce
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

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [messagesToDisplay, scrollToBottom]);

  const { openUserProfileModal } = useProfileModalControls();

  const jukeboxChatMessages = useMemo(
    () =>
      filteredMessages?.map((msg) => {
        const isUrl = isValidUrl(msg.text);
        return (
          <div key={msg.id} className="Jukebox__chat-messages">
            <span
              className="Jukebox__chat-author button--a"
              onClick={() => openUserProfileModal(msg.author)}
            >
              {msg.author.partyName}
            </span>{" "}
            <span>
              {isUrl && "changed video source to "}
              {msg.text}
            </span>
          </div>
        );
      }),
    [filteredMessages, openUserProfileModal]
  );

  return (
    <>
      <div className="Jukebox__container">
        <div className="Jukebox__chat">
          <span className="Jukebox__chat-messages--info">
            JUKEBOX RULES: There’s no queue system. If you post up your link,
            it’ll play. Be courteous people, do not post a new link until the
            other one is finished!
          </span>
          {jukeboxChatMessages}
          <div ref={messagesEndRef} />
        </div>
        <form className="Jukebox__form" onSubmit={sendMessageToChat}>
          <InputField
            containerClassName="Jukebox__input-container"
            inputClassName="Jukebox__input"
            ref={register({ required: true })}
            name="jukeboxMessage"
            placeholder="Add an embeddable link (YouTube, Vimeo, Twitch, etc.)"
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
