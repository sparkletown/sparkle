import { useMemo, useCallback } from "react";

import { voteInVenuePoll, createVenuePoll } from "api/poll";

import { PollMessage, PollValues, VoteInPoll } from "types/chat";

import { buildMessage } from "utils/chat";

import { useVenueId } from "./useVenueId";
import { useUser } from "./useUser";

export const useVenuePoll = () => {
  const venueId = useVenueId();
  const { userId } = useUser();

  const voteInPoll = useCallback(
    (props: VoteInPoll) => {
      if (!venueId) return;

      voteInVenuePoll({ ...props, venueId });
    },
    [venueId]
  );

  const createPoll = useCallback(
    (pollValues: PollValues) => {
      if (!venueId || !userId) return;

      const poll = buildMessage<PollMessage>({
        poll: pollValues,
        from: userId,
        text: "poll",
        votes: [],
      });

      createVenuePoll({ venueId, poll });
    },
    [venueId, userId]
  );

  return useMemo(
    () => ({
      createPoll,
      voteInPoll,
    }),
    [createPoll, voteInPoll]
  );
};
