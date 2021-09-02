import { useCallback, useMemo } from "react";
import { isEqual } from "lodash";

import { sendJukeboxMessage } from "api/jukebox";

import { JukeboxMessage, SendJukeboxMessage } from "types/jukebox";

import {
  getBaseMessageToDisplay,
  partitionMessagesFromReplies,
} from "utils/chat";
import { WithId } from "utils/id";
import { buildJukeboxMessage } from "utils/jukebox";
import { jukeboxMessagesSelector } from "utils/selectors";
import { isTruthy } from "utils/types";

import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useWorldUsersByIdWorkaround } from "hooks/users";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

const noMessages: WithId<JukeboxMessage>[] = [];

export const useJukeboxChat = ({
  venueId,
  tableId,
}: {
  venueId?: string;
  tableId?: string;
}) => {
  const messagesToDisplay = useJukeboxMessages(venueId, tableId);

  const { sendJukeboxMsg } = useJukeboxActions(venueId, tableId);

  return {
    messagesToDisplay,
    sendJukeboxMsg,
  };
};

const useJukeboxActions = (venueId?: string, tableId?: string) => {
  const { userId } = useUser();

  const sendJukeboxMsg: SendJukeboxMessage = useCallback(
    async ({ message }) => {
      if (!venueId || !userId || !tableId) return;

      const processedMessage = buildJukeboxMessage<JukeboxMessage>({
        from: userId,
        text: message,
        tableId,
      });
      return sendJukeboxMessage({
        venueId,
        tableId,
        message: processedMessage,
      });
    },
    [venueId, userId, tableId]
  );

  return {
    sendJukeboxMsg,
  };
};

const useJukeboxMessages = (venueId?: string, tableId?: string) => {
  const { worldUsersById } = useWorldUsersByIdWorkaround();
  const { userId } = useUser();

  useConnectVenueJukeboxMessages(venueId, tableId);

  const jukeboxMessages =
    useSelector(jukeboxMessagesSelector, isEqual) ?? noMessages;

  const { messages } = useMemo(
    () => partitionMessagesFromReplies(jukeboxMessages),
    [jukeboxMessages]
  );

  return useMemo(
    () =>
      messages
        .map((message) => {
          const displayMessage = getBaseMessageToDisplay<
            WithId<JukeboxMessage>
          >({
            message,
            usersById: worldUsersById,
            myUserId: userId,
          });

          if (!displayMessage) return undefined;

          return displayMessage;
        })
        .filter(isTruthy),
    [userId, worldUsersById, messages]
  );
};

const useConnectVenueJukeboxMessages = (venueId?: string, tableId?: string) => {
  useFirestoreConnect(
    venueId && tableId
      ? {
          collection: "venues",
          doc: venueId,
          subcollections: [{ collection: "jukeboxMessages" }],
          orderBy: ["ts_utc", "desc"],
          storeAs: "venueJukeboxMessages",
        }
      : undefined
  );
};
