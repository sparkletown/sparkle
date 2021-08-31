import { useCallback, useMemo } from "react";
import { isEqual } from "lodash";

import { VENUE_CHAT_AGE_DAYS } from "settings";

import { sendJukeboxMessage } from "api/jukebox";

import { JukeboxMessage, SendJukeboxMessage } from "types/jukebox";

import {
  getBaseMessageToDisplay,
  getMessageReplies,
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

export const useJukeboxChat = (venueId?: string, tableId?: number) => {
  const messagesToDisplay = useChatMessages(venueId, tableId);

  const { sendJukeboxMsg } = useJukeboxActions(venueId);

  return {
    messagesToDisplay,
    sendJukeboxMsg,
  };
};

const useJukeboxActions = (venueId?: string) => {
  const { userId } = useUser();

  const sendJukeboxMsg: SendJukeboxMessage = useCallback(
    async ({ message, url }) => {
      if (!venueId || !userId) return;

      const processedMessage = buildJukeboxMessage<JukeboxMessage>({
        from: userId,
        text: message,
        url: url,
      });

      return sendJukeboxMessage({ venueId, message: processedMessage });
    },
    [venueId, userId]
  );

  return {
    sendJukeboxMsg,
  };
};

const useChatMessages = (venueId?: string, tableId?: number) => {
  const { worldUsersById } = useWorldUsersByIdWorkaround();
  const { userId } = useUser();

  useConnectVenueChatMessages(venueId, tableId);

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

  const { messages, allMessagesReplies } = useMemo(
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

          const messageReplies = getMessageReplies<JukeboxMessage>({
            messageId: message.id,
            allReplies: allMessagesReplies,
          })
            .map((reply) =>
              getBaseMessageToDisplay<WithId<JukeboxMessage>>({
                message: reply,
                usersById: worldUsersById,
                myUserId: userId,
              })
            )
            .filter(isTruthy);

          return { ...displayMessage, replies: messageReplies };
        })
        .filter(isTruthy),
    [userId, worldUsersById, messages, allMessagesReplies]
  );
};

const useConnectVenueChatMessages = (venueId?: string, tableId?: number) => {
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
