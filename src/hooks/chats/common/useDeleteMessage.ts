import { useCallback } from "react";
import firebase from "firebase/app";

import { CHAT_MESSAGE_TIMEOUT } from "settings";

import { DeleteMessage } from "types/chat";

import { waitAtLeast } from "utils/promise";

export const useDeleteMessage = (
  collectionRefs: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>[],
  hardDelete?: boolean
): DeleteMessage =>
  useCallback(
    async (messageId: string) => {
      const batch = firebase.firestore().batch();

      if (hardDelete)
        collectionRefs.forEach((ref) => batch.delete(ref.doc(messageId)));
      else
        collectionRefs.forEach((ref) =>
          batch.update(ref.doc(messageId), { deleted: true })
        );

      await waitAtLeast(CHAT_MESSAGE_TIMEOUT, batch.commit());
    },
    [collectionRefs, hardDelete]
  );
