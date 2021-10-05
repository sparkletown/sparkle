import { useCallback } from "react";
import firebase from "firebase/app";

import { CHAT_MESSAGE_TIMEOUT } from "settings";

import { BaseChatMessage, SendThreadReply } from "types/chat";

import { buildBaseMessage, ExcludeBuiltMessage } from "utils/chat";
import { waitAtLeast } from "utils/promise";

import { useUser } from "hooks/useUser";

export const useSendThreadReply = <T extends BaseChatMessage>(
  collections: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>[],
  spreadOnMessage: ExcludeBuiltMessage<T>
): SendThreadReply => {
  const { userWithId } = useUser();

  return useCallback(
    async ({ replyText, threadId }) => {
      if (!userWithId) return;

      const threadReply = buildBaseMessage<T>(replyText, userWithId, {
        threadId,
        ...spreadOnMessage,
      });

      if (!threadReply) return;

      const batch = firebase.firestore().batch();

      collections.forEach((ref) => batch.set(ref.doc(), threadReply));

      await waitAtLeast(CHAT_MESSAGE_TIMEOUT, batch.commit());
    },
    [collections, spreadOnMessage, userWithId]
  );
};
