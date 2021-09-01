import { useCallback, useMemo } from "react";
import { isEqual } from "lodash";

import { VENUE_CHAT_AGE_DAYS } from "settings";

import { sendJukeboxMessage } from "api/jukebox";

import { JukeboxMessage, SendJukeboxMessage } from "types/jukebox";

import {
  getBaseMessageToDisplay,
  partitionMessagesFromReplies,
} from "utils/chat";
import { WithId } from "utils/id";
import { buildJukeboxMessage } from "utils/jukebox";
import { jukeboxMessagesSelector } from "utils/selectors";
import { getDaysAgoInSeconds } from "utils/time";
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
    async ({ message, url }) => {
      if (!venueId || !userId || !tableId) return;
      const processedMessage = buildJukeboxMessage<JukeboxMessage>({
        from: userId,
        text: message,
        url: url,
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

  const chatMessages =
    useSelector(jukeboxMessagesSelector, isEqual) ?? noMessages;

  const venueChatAgeThresholdSec = getDaysAgoInSeconds(VENUE_CHAT_AGE_DAYS);

  const filteredMessages = useMemo(
    () =>
      chatMessages.filter(
        (message) => message.ts_utc.seconds > venueChatAgeThresholdSec
      ),
    [chatMessages, venueChatAgeThresholdSec]
  );

  const { messages } = useMemo(
    () => partitionMessagesFromReplies(filteredMessages),
    [filteredMessages]
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

          return { ...displayMessage };
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
