import { useMemo, useCallback } from "react";
import firebase from "firebase/app";

import { voteInVenuePoll, createVenuePoll, deleteVenuePoll } from "api/poll";

import { PollMessage, PollValues } from "types/chat";

import { useVenueId } from "./useVenueId";
import { useUser } from "./useUser";

export const useVenuePoll = () => {
  const venueId = useVenueId();
  const { user } = useUser();

  const userId = user?.uid;

  const voteInPoll = useCallback(
    (poll: PollValues, votes: string[], pollId: string) => {
      if (!venueId) return;

      voteInVenuePoll({ venueId, poll, votes, pollId });
    },
    [venueId]
  );

  const createPoll = useCallback(
    (pollValues: PollValues) => {
      if (!venueId || !userId) return;

      const poll: PollMessage = {
        poll: pollValues,
        from: userId,
        message: "poll",
        votes: [],
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
