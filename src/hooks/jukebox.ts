import { useCallback, useMemo } from "react";
import { isEqual } from "lodash";

import { sendJukeboxMessage } from "api/jukebox";

import { JukeboxMessage } from "types/chat";
import { SendJukeboxMessage } from "types/jukebox";

import {
  buildMessage,
  filterNewSchemaMessages,
  partitionMessagesFromReplies,
} from "utils/chat";
import { WithId } from "utils/id";
import { jukeboxMessagesSelector } from "utils/selectors";
import { isTruthy } from "utils/types";

import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

const noMessages: WithId<JukeboxMessage>[] = [];

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
  useConnectVenueJukeboxMessages(venueId, tableId);

  const jukeboxMessages =
    filterNewSchemaMessages<JukeboxMessage>(
      useSelector(jukeboxMessagesSelector, isEqual)
    ) ?? noMessages;

  const { messages } = useMemo(
    () => partitionMessagesFromReplies(jukeboxMessages),
    [jukeboxMessages]
  );
  return useMemo(() => messages.filter(isTruthy), [messages]);
};

const useConnectVenueJukeboxMessages = (
  venueId?: string,
  tableId?: string | null
) => {
  useFirestoreConnect(
    venueId && tableId
      ? {
          collection: "venues",
          doc: venueId,
          subcollections: [{ collection: "jukeboxMessages" }],
          orderBy: ["timestamp", "asc"],
          storeAs: "venueJukeboxMessages",
        }
      : undefined
  );
};
