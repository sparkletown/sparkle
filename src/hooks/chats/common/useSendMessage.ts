import { useCallback } from "react";
import { useFirestore } from "reactfire";
import firebase from "firebase/compat/app";
import {
  CollectionReference,
  doc,
  DocumentData,
  WriteBatch,
  writeBatch,
} from "firebase/firestore";
import { noop } from "lodash";

import { CHAT_MESSAGE_TIMEOUT } from "settings";

import {
  BaseChatMessage,
  SendChatMessage,
  SendChatMessageProps,
  SendMessagePropsBase,
  SendThreadMessageProps,
} from "types/chat";
import { CompatCollectionReference, CompatDocumentData } from "types/Firestore";

import { buildBaseMessage, ExcludeBuiltMessage } from "utils/chat";
import { waitAtLeast } from "utils/promise";

import { useLiveUser } from "hooks/user/useLiveUser";

export const useSendChatMessage = <T extends BaseChatMessage>(
  chats: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>[],
  additionalMessageFields: ExcludeBuiltMessage<T>
): SendChatMessage<SendChatMessageProps> => {
  const getCollections = useCallback(() => chats, [chats]);
  const getAdditionalFields = useCallback(() => additionalMessageFields, [
    additionalMessageFields,
  ]);

  return useSendMessage<T, SendChatMessageProps>({
    getCollections,
    getAdditionalFields,
  });
};

export const useSendThreadMessage = <T extends BaseChatMessage>(
  chats: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>[],
  spreadOnMessage: ExcludeBuiltMessage<T>
): SendChatMessage<SendThreadMessageProps> => {
  const getCollections = useCallback(() => chats, [chats]);
  const getAdditionalFields: (
    props: SendThreadMessageProps
  ) => ExcludeBuiltMessage<T> = useCallback(
    ({ threadId }) => ({ threadId, ...spreadOnMessage }),
    [spreadOnMessage]
  );

  return useSendMessage<T, SendThreadMessageProps>({
    getCollections,
    getAdditionalFields,
  });
};

export interface UseSendMessageProps<
  T extends BaseChatMessage,
  K extends SendMessagePropsBase
> {
  getCollections: (
    props: K
  ) => firebase.firestore.CollectionReference<firebase.firestore.DocumentData>[];
  getAdditionalFields: (props: K) => ExcludeBuiltMessage<T>;
  processResultingBatch?: (props: K, batch: WriteBatch) => void;
}

export const useSendMessage = <
  T extends BaseChatMessage,
  K extends SendMessagePropsBase
>({
  getCollections,
  getAdditionalFields,
  processResultingBatch = noop,
}: UseSendMessageProps<T, K>): SendChatMessage<K> => {
  const { userWithId } = useLiveUser();
  const firestore = useFirestore();

  return useCallback(
    async (props) => {
      try {
        if (!userWithId) return;

        const processedMessage = buildBaseMessage<T>(props.text, userWithId, {
          ...getAdditionalFields(props),
        });

        const batch = writeBatch(firestore);

        const collections: CompatCollectionReference<CompatDocumentData>[] = getCollections(
          props
        );
        for (const ref of collections) {
          batch.set<DocumentData>(
            doc((ref as unknown) as CollectionReference),
            processedMessage
          );
        }

        processResultingBatch(props, batch);

        await waitAtLeast(CHAT_MESSAGE_TIMEOUT, batch.commit());
      } catch (e) {
        console.error(e);
      }
    },
    [
      userWithId,
      getAdditionalFields,
      firestore,
      getCollections,
      processResultingBatch,
    ]
  );
};
