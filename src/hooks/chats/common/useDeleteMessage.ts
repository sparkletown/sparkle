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
    messageRefs: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>[],
    batch: firebase.firestore.WriteBatch
  ) => void;
}

export const useDeleteMessage = <T extends DeleteChatMessageProps>({
  getCollections,
  processResultingBatch = noop,
}: UseDeleteMessageProps<T>): DeleteChatMessage<T> =>
  useCallback(
    async (props) => {
      const batch = firebase.firestore().batch();

      const collectionRefs = getCollections(props);
      const messageRefs = collectionRefs.map((ref) => ref.doc(props.messageId));
      messageRefs.forEach((ref) => batch.delete(ref));

      processResultingBatch(props, messageRefs, batch);

      await waitAtLeast(CHAT_MESSAGE_TIMEOUT, batch.commit());
    },
    [getCollections, processResultingBatch]
  );
