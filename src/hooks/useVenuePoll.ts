import { useMemo, useCallback } from "react";
import firebase from "firebase/app";

import { voteInVenuePoll, createVenuePoll, deleteVenuePoll } from "api/poll";

import { PollMessage, PollQuestion, PollValues } from "types/chat";

// import { venueChatMessagesSelector } from "utils/selectors";
// import { getDaysAgoInSeconds } from "utils/time";

// import { useSelector } from "./useSelector";
import { useFirestoreConnect } from "./useFirestoreConnect";
import { useVenueId } from "./useVenueId";
import { useUser } from "./useUser";
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
  const { user } = useUser();

  const userId = user?.uid;

  useConnectVenueChatMessages(venueId);

  const voteInPoll = useCallback(
    (question: PollQuestion) => {
      if (!venueId) return;

      voteInVenuePoll({ venueId, question });
    },
    [venueId]
  );

  const createPoll = useCallback(
    (pollData: PollValues) => {
      if (!venueId || !userId) return;

      const poll: PollMessage = {
        poll: pollData,
        from: userId,
        text: "",
        ts_utc: firebase.firestore.Timestamp.now(),
      };

      createVenuePoll({ venueId, poll });
    },
    [venueId, userId]
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
