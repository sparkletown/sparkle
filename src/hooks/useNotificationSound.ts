import { useEffect, useState } from "react";
import useSound from "use-sound";

import notificationSound from "assets/sounds/newmessage.m4a";

import { PrivateChatMessage, ChatTypes } from "types/chat";

import { useChatSidebarControls } from "hooks/chatSidebar";

import { useUser } from "./useUser";
import { WithId } from "utils/id";

export const useNotificationSound = (
  privateChatMessages?: WithId<PrivateChatMessage>[]
) => {
  const { user } = useUser();
  const userId = user?.uid;

  const { chatSettings } = useChatSidebarControls();

  const [play] = useSound(notificationSound, {
    // `interrupt` ensures that if the sound starts again before it's
    // ended, it will truncate it. Otherwise, the sound can overlap.
    interrupt: true,
  });

  const [privateChatMessagesState, setPrivateChatMessagesState] = useState(
    privateChatMessages
  );

  const chatWithUser =
    chatSettings.openedChatType === ChatTypes.PRIVATE_CHAT
      ? chatSettings.recipientId
      : undefined;

  useEffect(() => {
    const newMessage = privateChatMessages?.filter(
      ({ id: id1 }) =>
        !privateChatMessagesState?.some(({ id: id2 }) => id2 === id1)
    );

    if (privateChatMessagesState === undefined) {
      setPrivateChatMessagesState(privateChatMessages);
    }

    if (
      privateChatMessages !== undefined &&
      privateChatMessagesState !== undefined &&
      newMessage !== undefined &&
      newMessage.length !== 0 &&
      privateChatMessages.length !== privateChatMessagesState.length &&
      !newMessage[0].isRead &&
      newMessage[0].from !== userId
    ) {
      setPrivateChatMessagesState(privateChatMessages);

      if (chatWithUser === undefined) {
        play();
      } else if (chatWithUser !== newMessage[0].from) {
        play();
      }
    }
  }, [
    privateChatMessages,
    chatWithUser,
    play,
    privateChatMessagesState,
    userId,
  ]);
};
