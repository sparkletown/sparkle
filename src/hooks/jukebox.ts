import { useCallback } from "react";
import { useFirestore } from "reactfire";

import { sendJukeboxMessage } from "api/jukebox";

import { JukeboxMessage } from "types/chat";
import { SendJukeboxMessage } from "types/jukebox";

import { buildMessage } from "utils/chat";

import { useChatMessages } from "hooks/chats/useChatMessagesForDisplay";
import { useUser } from "hooks/useUser";

export const useJukeboxChat = ({
  venueId,
  tableId,
}: {
  venueId?: string;
  tableId?: string | null;
}) => {
  const messagesToDisplay = useJukeboxMessages(venueId, tableId);

  const { sendJukeboxMsg } = useJukeboxActions(venueId, tableId);

  return {
    messagesToDisplay,
    sendJukeboxMsg,
  };
};

const useJukeboxActions = (venueId?: string, tableId?: string | null) => {
  const { userWithId } = useUser();

  const sendJukeboxMsg: SendJukeboxMessage = useCallback(
    async ({ message }) => {
      if (!venueId || !userWithId || !tableId) return;

      const processedMessage = buildMessage<JukeboxMessage>(userWithId, {
        text: message,
        tableId,
      });

      return sendJukeboxMessage({
        venueId,
        tableId,
        message: processedMessage,
      });
    },
    [venueId, userWithId, tableId]
  );

  return {
    sendJukeboxMsg,
  };
};

const useJukeboxMessages = (venueId?: string, tableId?: string | null) => {
  const firestore = useFirestore();

  const [{ messages }] = useChatMessages<JukeboxMessage>(
    firestore
      .collection("venues")
      .doc(venueId)
      .collection("jukeboxMessages")
      .orderBy("timestamp", "asc")
  );

  return messages;
};
