import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import classNames from "classnames";
import { InputField } from "components/attendee/InputField";

import { UserId } from "types/id";
import { AnyVenue } from "types/venues";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";
import { WithId } from "utils/id";
import { isValidUrl } from "utils/url";

import { useJukeboxChat } from "hooks/chats/jukebox/useJukeboxChat";
import { useProfileModalControls } from "hooks/useProfileModalControls";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./Jukebox.scss";

type JukeboxTypeProps = {
  updateIframeUrl: Dispatch<SetStateAction<string>>;
  venue: WithId<AnyVenue>;
  tableRef: string | undefined;
};

export const Jukebox: React.FC<JukeboxTypeProps> = ({
  updateIframeUrl,
  tableRef,
  venue,
}) => {
  const { register, handleSubmit, watch, reset } = useForm<{
    jukeboxMessage: string;
  }>({
    mode: "onSubmit",
  });
  const chatValue = watch("jukeboxMessage");

  const { sendChatMessage, messagesToDisplay } = useJukeboxChat({
    venueId: venue.id,
    tableId: tableRef,
  });

  const filteredMessages = messagesToDisplay
    .filter(({ tableId }) => tableId === tableRef)
    .reverse();

  useEffect(() => {
    const [lastMessage] = filteredMessages.slice(-1);

    if (!isValidUrl(lastMessage?.text)) {
      return;
    }

    const urlToEmbed = convertToEmbeddableUrl({ url: lastMessage?.text });

    updateIframeUrl(urlToEmbed);
  }, [filteredMessages, updateIframeUrl, venue.id]);

  const [{ loading: isSendingMessage }, sendMessageToChat] = useAsyncFn(
    async ({ jukeboxMessage }) =>
      sendChatMessage({ text: jukeboxMessage }).then(() => reset()),
    [reset, sendChatMessage]
  );

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
              onClick={() => openUserProfileModal(msg.fromUser.id as UserId)}
            >
              {msg.fromUser.partyName}
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
      <div data-bem="Jukebox__container">
        <div data-bem="Jukebox__chat">
          <span data-bem="Jukebox__chat-messages--info">
            JUKEBOX RULES: There’s no queue system. If you post up your link,
            it’ll play. Be courteous people, do not post a new link until the
            other one is finished!
          </span>
          {jukeboxChatMessages}
          <div ref={messagesEndRef} />
        </div>
        <form
          data-bem="Jukebox__form"
          onSubmit={handleSubmit(sendMessageToChat)}
        >
          <InputField
            containerClassName="Jukebox__input-container"
            inputClassName="Jukebox__input"
            name="jukeboxMessage"
            register={register}
            rules={{ required: true }}
            placeholder="Add an embeddable link (YouTube, Vimeo, Twitch, etc.)"
            autoComplete="off"
          />

          <div data-bem="Jukebox__buttons">
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
