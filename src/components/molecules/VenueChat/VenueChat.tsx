import React, { useEffect, useState, useMemo, FC, useCallback } from "react";

import { VENUE_CHAT_AGE_DAYS } from "settings";

import { getDaysAgoInSeconds, roundToNearestHour } from "utils/time";
import { currentVenueSelectorData, venueChatsSelector } from "utils/selectors";

import { useDispatch } from "hooks/useDispatch";
import useRoles from "hooks/useRoles";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { useVenueId } from "hooks/useVenueId";

import { chatSort } from "utils/chat";
import ChatBox from "components/molecules/Chatbox";

import "./VenueChat.scss";
import { sendRoomChat } from "store/actions/Chat";
import { useConnectVenueChats } from "hooks/useConnectVenueChats";

interface ChatOutDataType {
  messageToTheBand: string;
}

const VenueChat: FC = () => {
  const venueId = useVenueId();
  useConnectVenueChats(venueId);

  const { userRoles } = useRoles();
  const { user } = useUser();

  const chats = useSelector(venueChatsSelector) ?? [];
  const venue = useSelector(currentVenueSelectorData);

  const [isMessageToTheBarSent, setIsMessageToTheBarSent] = useState(false);

  useEffect(() => {
    if (isMessageToTheBarSent) {
      setTimeout(() => {
        setIsMessageToTheBarSent(false);
      }, 2000);
    }
  }, [isMessageToTheBarSent]);

  const dispatch = useDispatch();

  const submitMessage = useCallback(
    async (data: ChatOutDataType) => {
      user &&
        venueId &&
        dispatch(
          sendRoomChat({
            venueId,
            from: user.uid,
            to: venueId,
            text: data.messageToTheBand,
          })
        );
    },
    [user, venueId, dispatch]
  );

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
        .sort(chatSort),
    [chats, venueId, HIDE_BEFORE]
  );

  const allowDelete = useMemo(() => {
    return (
      ((userRoles && userRoles.includes("admin")) ||
        (user && venue?.owners?.includes(user.uid))) ??
      false
    );
  }, [user, userRoles, venue]);

  return (
    <ChatBox
      allowDelete={allowDelete}
      chats={chatsToDisplay}
      onMessageSubmit={submitMessage}
      emptyListMessage="Be the first to publish in the chat"
      isVenueChat
    />
  );
};

export default VenueChat;
