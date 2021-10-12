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
}

export const useDeleteMessage = <T extends DeleteChatMessageProps>({
  getCollections,
  processResultingBatch = noop,
}: UseDeleteMessageProps<T>): DeleteChatMessage<T> =>
  useCallback(
    async (props) => {
      const batch = firebase.firestore().batch();
      const collectionRefs = getCollections(props);

      collectionRefs.forEach((ref) => batch.delete(ref.doc(props.messageId)));
      processResultingBatch(props, batch);

      await waitAtLeast(CHAT_MESSAGE_TIMEOUT, batch.commit());
    },
    [getCollections, processResultingBatch]
  );
