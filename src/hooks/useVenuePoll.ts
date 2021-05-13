import { useMemo, useCallback } from "react";

// import { VENUE_CHAT_AGE_DAYS } from "settings";

import { voteInVenuePoll, createVenuePoll, deleteVenuePoll } from "api/poll";

import { PollQuestion, PollValues } from "types/chat";

// import { buildMessage, chatSort, getMessageToDisplay } from "utils/chat";
// import { venueChatMessagesSelector } from "utils/selectors";
// import { getDaysAgoInSeconds } from "utils/time";

// import { useSelector } from "./useSelector";
import { useFirestoreConnect } from "./useFirestoreConnect";
import { useVenueId } from "./useVenueId";
// import { useUser } from "./useUser";
// import { useWorldUsersById } from "./users";
// import { useRoles } from "./useRoles";

export const useConnectVenueChatMessages = (venueId?: string) => {
  useFirestoreConnect(
    venueId
      ? {
          collection: "venues",
          doc: venueId,
          subcollections: [{ collection: "chats" }],
          storeAs: "venueChatMessages",
        }
      : undefined
  );
};

export const useVenuePoll = () => {
  const venueId = useVenueId();
  // const { worldUsersById } = useWorldUsersById();
  // const { userRoles } = useRoles();
  // const { user } = useUser();

  // const userId = user?.uid;

  useConnectVenueChatMessages(venueId);

  const voteInPoll = useCallback(
    (question: PollQuestion) => {
      if (!venueId) return;

      voteInVenuePoll({ venueId, question });
    },
    [venueId]
  );

  const createPoll = useCallback(
    (data: PollValues) => {
      if (!venueId) return;

      createVenuePoll({ venueId, data });
    },
    [venueId]
  );

  const deletePoll = useCallback(
    (pollId: string) => {
      if (!venueId) return;

      deleteVenuePoll({ venueId, pollId });
    },
    [venueId]
  );

  return useMemo(
    () => ({
      createPoll,
      deletePoll,
      voteInPoll,
    }),
    [createPoll, deletePoll, voteInPoll]
  );
};
