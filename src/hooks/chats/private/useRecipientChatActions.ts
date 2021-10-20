import { useCallback, useMemo } from "react";
import firebase from "firebase/app";

import { getUserChatsCollectionRef, setChatMessageRead } from "api/chat";
import { updateBatchWithUserLookup } from "api/user";

import {
  MarkMessageRead,
  PrivateChatActions,
  PrivateChatMessage,
  SendMessagePropsBase,
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

  const additionalMessageFields = useMemo(
    () => ({
      toUser: pickDisplayUserFromUser(recipient),
    }),
    [recipient]
  );

  const processBatch = useCallback(
    (
      props: SendMessagePropsBase,
      messageRefs: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>[],
      batch: firebase.firestore.WriteBatch
    ) => {
      if (!userId) return;
      if (messageRefs.length !== 2) {
        console.error("Invalid messageRefs", messageRefs);
        return;
      }

      updateBatchWithUserLookup(batch, userId, messageRefs[0], "fromUser");
      updateBatchWithUserLookup(batch, recipient.id, messageRefs[1], "toUser");
    },
    [recipient.id, userId]
  );

  const sendMessage = useSendChatMessage<PrivateChatMessage>(
    refs,
    additionalMessageFields,
    processBatch
  );

  const sendThreadReply = useSendThreadMessage<PrivateChatMessage>(
    refs,
    additionalMessageFields,
    processBatch
  );

  return useMemo(
    () => ({
      sendChatMessage: sendMessage,
      sendThreadMessage: sendThreadReply,
      markMessageRead,
    }),
    [markMessageRead, sendMessage, sendThreadReply]
  );
};
