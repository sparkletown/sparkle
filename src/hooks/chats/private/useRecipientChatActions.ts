import { useCallback, useMemo } from "react";

import { getUserChatsCollectionRef, setChatMessageRead } from "api/chat";

import {
  MarkMessageRead,
  PrivateChatActions,
  PrivateChatMessage,
} from "types/chat";
import { DisplayUser } from "types/User";

import { pickDisplayUserFromUser } from "utils/chat";
import { WithId } from "utils/id";

import {
  useSendChatMessage,
  useSendThreadMessage,
} from "hooks/chats/common/useSendMessage";
import { useUser } from "hooks/useUser";

export const useRecipientChatActions = (
  recipient: WithId<DisplayUser>
): PrivateChatActions => {
  const { userId } = useUser();

  const refs = useMemo(() => {
    if (!userId) return [];
    const authorRef = getUserChatsCollectionRef(userId);
    const recipientRef = getUserChatsCollectionRef(recipient.id);
    return [authorRef, recipientRef];
  }, [recipient.id, userId]);

  const markMessageRead: MarkMessageRead = useCallback(
    async (messageId: string) => {
      if (!userId) return;

      return setChatMessageRead({ userId, messageId });
    },
    [userId]
  );

  const spread = useMemo(
    () => ({
      toUser: pickDisplayUserFromUser(recipient),
    }),
    [recipient]
  );

  const sendMessage = useSendChatMessage<PrivateChatMessage>(refs, spread);
  const sendThreadReply = useSendThreadMessage<PrivateChatMessage>(
    refs,
    spread
  );

  return {
    sendChatMessage: sendMessage,
    sendThreadMessage: sendThreadReply,
    markMessageRead,
  };
};
