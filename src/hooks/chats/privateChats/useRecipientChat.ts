import { useCallback, useMemo } from "react";
import { useFirestore } from "reactfire";

import { getUserChatsCollectionRef, setChatMessageRead } from "api/chat";

import {
  MarkMessageRead,
  PrivateChatActions,
  PrivateChatMessage,
} from "types/chat";
import { DisplayUser } from "types/User";

import { pickDisplayUserFromUser } from "utils/chat";
import { WithId } from "utils/id";

import { useChatActions } from "hooks/chats/useChatActions";
import { useChatMessagesForDisplay } from "hooks/chats/useChatMessages";
import { useUser } from "hooks/useUser";

export const useRecipientChat = (recipient: WithId<DisplayUser>) => {
  const chatActions = useRecipientChatActions(recipient);
  const { userId } = useUser();
  const firestore = useFirestore();

  const [messagesToDisplay] = useChatMessagesForDisplay<PrivateChatMessage>(
    firestore.collection("privatechats").doc(userId).collection("chats"),
    (message) =>
      message.toUser.id === recipient.id || message.fromUser.id === recipient.id
  );

  return {
    ...chatActions,
    messagesToDisplay,
  };
};

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

  const chatActions = useChatActions<PrivateChatMessage>(refs, {
    toUser: pickDisplayUserFromUser(recipient),
  });

  return {
    ...chatActions,
    markMessageRead,
  };
};
