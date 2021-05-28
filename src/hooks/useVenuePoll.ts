import { useMemo, useCallback } from "react";

import { sendVenueMessage, voteInVenuePoll } from "api/chat";

import { ChatMessageType, PollMessage, PollValues, PollVote } from "types/chat";

import { buildMessage } from "utils/chat";

import { useVenueId } from "./useVenueId";
import { useUser } from "./useUser";

export const useVenuePoll = () => {
  const venueId = useVenueId();
  const { userId } = useUser();

  const voteInPoll = useCallback(
    (pollVote: PollVote) => {
      if (!venueId) return;

      voteInVenuePoll({ ...pollVote, venueId });
    },
    [venueId]
  );

  const createPoll = useCallback(
    (pollValues: PollValues) => {
      if (!venueId || !userId) return;

      const message = buildMessage<PollMessage>({
        poll: pollValues,
        type: ChatMessageType.poll,
        from: userId,
        votes: [],
        text: "",
      });

      sendVenueMessage({ venueId, message });
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
