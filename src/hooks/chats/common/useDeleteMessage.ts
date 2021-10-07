import { useCallback } from "react";
import firebase from "firebase/app";
import { noop } from "lodash";

import { CHAT_MESSAGE_TIMEOUT } from "settings";

import { DeleteChatMessage, DeleteChatMessageProps } from "types/chat";

import { waitAtLeast } from "utils/promise";

export interface UseDeleteMessageProps<T extends DeleteChatMessageProps> {
  getCollections: (
    props: T
  ) => firebase.firestore.CollectionReference<firebase.firestore.DocumentData>[];
  processResultingBatch?: (
    props: T,
    batch: firebase.firestore.WriteBatch
  ) => void;
  hardDelete?: boolean;
}

export const useDeleteMessage = <T extends DeleteChatMessageProps>({
  getCollections,
  hardDelete,
  processResultingBatch = noop,
}: UseDeleteMessageProps<T>): DeleteChatMessage<T> =>
  useCallback(
    async (props) => {
      const batch = firebase.firestore().batch();
      const collectionRefs = getCollections(props);

      if (hardDelete)
        collectionRefs.forEach((ref) => batch.delete(ref.doc(props.messageId)));
      else
        collectionRefs.forEach((ref) =>
          batch.update(ref.doc(props.messageId), { deleted: true })
        );
      processResultingBatch(props, batch);

      await waitAtLeast(CHAT_MESSAGE_TIMEOUT, batch.commit());
    },
    [getCollections, hardDelete, processResultingBatch]
  );
