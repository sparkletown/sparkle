import { useCallback, useMemo } from "react";
import firebase from "firebase/app";

import { updateBatchWithAddUserLookup } from "api/userLookup";
import { getVenueRef } from "api/venue";

import {
  JukeboxChatActions,
  JukeboxMessage,
  SendMessagePropsBase,
} from "types/chat";

import { useChatMessages } from "hooks/chats/common/useChatMessages";
import { useSendChatMessage } from "hooks/chats/common/useSendMessage";
import { useUser } from "hooks/useUser";

export const useJukeboxChat = ({
  venueId,
  tableId,
}: {
  venueId?: string;
  tableId?: string | null;
}) => {
  const messagesToDisplay = useJukeboxMessages(venueId);

  const actions = useJukeboxActions(venueId, tableId);

  return {
    messagesToDisplay,
    ...actions,
  };
};

const useJukeboxActions = (
  venueId?: string,
  tableId?: string | null
): JukeboxChatActions => {
  const { userId } = useUser();

  const collectionRefs = useMemo(
    () => (venueId ? [getVenueRef(venueId).collection("jukeboxMessages")] : []),
    [venueId]
  );
  const additionalFields = useMemo(
    () => ({
      tableId: tableId ?? "",
    }),
    [tableId]
  );

  const processBatch = useCallback(
    (
      props: SendMessagePropsBase,
      messageRefs: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>[],
      batch: firebase.firestore.WriteBatch
    ) => {
      if (!userId) return;

      if (messageRefs.length !== 1) {
        console.error("Invalid messageRefs", messageRefs);
        return;
      }

      updateBatchWithAddUserLookup(batch, userId, messageRefs[0], "fromUser");
    },
    [userId]
  );

  const sendMessage = useSendChatMessage<JukeboxMessage>(
    collectionRefs,
    additionalFields,
    processBatch
  );

  return { sendChatMessage: sendMessage };
};

const useJukeboxMessages = (venueId?: string) => {
  const [{ messages }] = useChatMessages<JukeboxMessage>(
    getVenueRef(venueId ?? "").collection("jukeboxMessages")
  );

  return messages;
};
