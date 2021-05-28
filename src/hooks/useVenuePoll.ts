import { useMemo, useCallback } from "react";

import { sendVenueMessage, voteInVenuePoll } from "api/chat";

import {
  ChatMessageType,
  PollMessage,
  PollValues,
  PollVoteBase,
} from "types/chat";

import { buildMessage } from "utils/chat";

import { useVenueId } from "./useVenueId";
import { useUser } from "./useUser";

export const useVenuePoll = () => {
  const venueId = useVenueId();
  const { userId } = useUser();

  const voteInPoll = useCallback(
    (pollVote: PollVoteBase) => {
      if (!venueId) return;

      voteInVenuePoll({ pollVote, venueId });
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
        // @debt remove this useless text from here
        text: "poll",
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
