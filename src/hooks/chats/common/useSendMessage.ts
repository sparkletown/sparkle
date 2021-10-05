import { useCallback } from "react";
import firebase from "firebase/app";

import { CHAT_MESSAGE_TIMEOUT } from "settings";

import { BaseChatMessage, SendMessage } from "types/chat";

import { buildBaseMessage, ExcludeBuiltMessage } from "utils/chat";
import { waitAtLeast } from "utils/promise";

import { useUser } from "hooks/useUser";

export const useSendMessage = <T extends BaseChatMessage>(
  collectionRefs: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>[],
  spreadOnMessage: ExcludeBuiltMessage<T>
): SendMessage => {
  const { userWithId } = useUser();

  return useCallback(
    async ({ message, isQuestion }) => {
      if (!userWithId) return;

      const processedMessage = buildBaseMessage<T>(message, userWithId, {
        ...(isQuestion && { isQuestion }),
        ...spreadOnMessage,
      });

      const batch = firebase.firestore().batch();

      collectionRefs.forEach((ref) => batch.set(ref.doc(), processedMessage));

      await waitAtLeast(CHAT_MESSAGE_TIMEOUT, batch.commit());
    },
    [collectionRefs, spreadOnMessage, userWithId]
  );
};
