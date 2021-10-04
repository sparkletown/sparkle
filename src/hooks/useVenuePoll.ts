import { useCallback, useMemo } from "react";

import { sendVenueMessage, voteInVenuePoll } from "api/chat";

import {
  ChatMessageType,
  PollMessage,
  PollValues,
  PollVoteBase,
} from "types/chat";

import { buildMessage } from "utils/chat";

import { useUser } from "./useUser";
import { useVenueId } from "./useVenueId";

export const useVenuePoll = () => {
  const venueId = useVenueId();
  const { userWithId } = useUser();

  const voteInPoll = useCallback(
    async (pollVote: PollVoteBase) => {
      if (!venueId) return;

      return voteInVenuePoll({ pollVote, venueId });
    },
    [venueId]
  );

  const createPoll = useCallback(
    async (pollValues: PollValues) => {
      if (!venueId || !userWithId) return;

      const message = buildMessage<PollMessage>("poll", userWithId, {
        poll: pollValues,
        type: ChatMessageType.poll,
        votes: [],
      });

      return sendVenueMessage({ venueId, message });
    },
    [venueId, userWithId]
  );

  return useMemo(
    () => ({
      createPoll,
      voteInPoll,
    }),
    [createPoll, voteInPoll]
  );
};
