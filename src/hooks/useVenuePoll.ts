import { useMemo, useCallback } from "react";
import firebase from "firebase/app";

import { voteInVenuePoll, createVenuePoll, deleteVenuePoll } from "api/poll";

import { PollMessage, PollValues, Vote } from "types/chat";

import { useVenueId } from "./useVenueId";
import { useUser } from "./useUser";

export const useVenuePoll = () => {
  const venueId = useVenueId();
  const { userId } = useUser();

  const voteInPoll = useCallback(
    (votes: Vote[], pollId: string) => {
      if (!venueId) return;

      voteInVenuePoll({ venueId, votes, pollId });
    },
    [venueId]
  );

  const createPoll = useCallback(
    (pollValues: PollValues) => {
      if (!venueId || !userId) return;

      const poll: PollMessage = {
        poll: pollValues,
        from: userId,
        text: "poll",
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
