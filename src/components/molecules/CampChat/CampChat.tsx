import React, { useContext, useEffect, useState, useMemo } from "react";
import firebase from "firebase/app";
import { MessageList } from "./MessageList";
import CallOutMessageForm from "components/molecules/CallOutMessageForm";
import { useForm } from "react-hook-form";
import { ChatContext } from "components/context/ChatContext";
import "./CampChat.scss";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faAngleDoubleLeft,
} from "@fortawesome/free-solid-svg-icons";
import useRoles from "hooks/useRoles";
import { useVenueId } from "hooks/useVenueId";
import { getDaysAgoInSeconds } from "utils/time";
import { VENUE_CHAT_AGE_DAYS } from "settings";

interface ChatOutDataType {
  messageToTheBand: string;
}

interface PropsType {
  roomName: string;
  chatInputPlaceholder: string;
}

const CampChat: React.FC<PropsType> = ({ roomName, chatInputPlaceholder }) => {
  const { user } = useUser();
  const venueId = useVenueId();
  const { userRoles } = useRoles();
  const venue = useSelector((state) => state.firestore.data.currentVenue);

  const chats = useSelector((state) => state.firestore.ordered.venueChats);
  const [isMessageToTheBarSent, setIsMessageToTheBarSent] = useState(false);

  useEffect(() => {
    if (isMessageToTheBarSent) {
      setTimeout(() => {
        setIsMessageToTheBarSent(false);
      }, 2000);
    }
  }, [isMessageToTheBarSent]);

  const chatContext = useContext(ChatContext);

  const { register, handleSubmit, reset } = useForm<ChatOutDataType>({
    mode: "onSubmit",
  });

  const onBarMessageSubmit = async (data: ChatOutDataType) => {
    setIsMessageToTheBarSent(true);
    chatContext &&
      user &&
      chatContext.sendRoomChat(user.uid, roomName, data.messageToTheBand);
    reset();
  };

  function roundToNearestHour(seconds: number) {
    const oneHour = 60 * 60;
    return Math.floor(seconds / oneHour) * oneHour;
  }
  const DAYS_AGO = getDaysAgoInSeconds(VENUE_CHAT_AGE_DAYS);
  const HIDE_BEFORE = roundToNearestHour(DAYS_AGO);

  const chatsToDisplay = useMemo(
    () =>
      chats &&
      chats
        .filter(
          (message) =>
            message.deleted !== true &&
            message.type === "room" &&
            message.to === roomName &&
            message.ts_utc.seconds > HIDE_BEFORE
        )
        .sort((a, b) => b.ts_utc.valueOf().localeCompare(a.ts_utc.valueOf())),
    [chats, roomName, HIDE_BEFORE]
  );

  const allowDelete =
    ((userRoles && userRoles.includes("admin")) ||
      (user && venue?.owners?.includes(user.uid))) ??
    false;

  const deleteMessage = async (id: string) => {
    await firebase
      .firestore()
      .doc(`venues/${venueId}/chats/${id}`)
      .update({ deleted: true });
  };

  return (
    <div className={`camp-chat-container`}>
      <div className="band-reaction-container">
        <div className="messages-container">
          {chatsToDisplay && (
            <MessageList
              messages={chatsToDisplay}
              allowDelete={allowDelete}
              deleteMessage={deleteMessage}
            />
          )}
          {chatsToDisplay && !chatsToDisplay.length && (
            <div>There are no messages</div>
          )}
          {!chatsToDisplay && <div>Loading messages</div>}
        </div>
        <CallOutMessageForm
          onSubmit={handleSubmit(onBarMessageSubmit)}
          ref={register({ required: true })}
          placeholder={chatInputPlaceholder}
          isMessageToTheBandSent={isMessageToTheBarSent}
        />
      </div>
    </div>
  );
};

export default CampChat;
