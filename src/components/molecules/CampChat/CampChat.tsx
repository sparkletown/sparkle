import React, { useContext, useEffect, useState, useMemo, FC } from "react";
import { ChatContext } from "components/context/ChatContext";
import "./CampChat.scss";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { useVenueId } from "hooks/useVenueId";
import { getDaysAgoInSeconds } from "utils/time";
import { VENUE_CHAT_AGE_DAYS } from "settings";
import ChatBox from "./Chatbox";
import useRoles from "hooks/useRoles";

interface ChatOutDataType {
  messageToTheBand: string;
}

const CampChat: FC = () => {
  const venueId = useVenueId();
  const { userRoles } = useRoles();
  const { user } = useUser();
  const { chats, venue } = useSelector((state) => ({
    chats: state.firestore.ordered.venueChats,
    venue: state.firestore.data.currentVenue,
  }));

  const [isMessageToTheBarSent, setIsMessageToTheBarSent] = useState(false);

  useEffect(() => {
    if (isMessageToTheBarSent) {
      setTimeout(() => {
        setIsMessageToTheBarSent(false);
      }, 2000);
    }
  }, [isMessageToTheBarSent]);

  const chatContext = useContext(ChatContext);

  const onMessageSubmit = async (data: ChatOutDataType) => {
    chatContext &&
      user &&
      chatContext.sendRoomChat(user.uid, venueId!, data.messageToTheBand);
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
            message.to === venueId &&
            message.ts_utc.seconds > HIDE_BEFORE
        )
        .sort((a, b) => b.ts_utc.valueOf().localeCompare(a.ts_utc.valueOf())),
    [chats, venueId, HIDE_BEFORE]
  );

  const allowDelete =
    ((userRoles && userRoles.includes("admin")) ||
      (user && venue?.owners?.includes(user.uid))) ??
    false;

  return (
    <ChatBox
      allowDelete={allowDelete}
      chats={chatsToDisplay}
      onMessageSubmit={onMessageSubmit}
      emptyListMessage="Be the first to publish in the chat"
    />
  );
};

export default CampChat;
