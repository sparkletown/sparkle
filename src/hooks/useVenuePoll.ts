import { useCallback, useMemo } from "react";

import { sendVenueMessage, voteInVenuePoll } from "api/chat";

import {
  ChatMessageType,
  PollMessage,
  PollValues,
  PollVoteBase,
} from "types/chat";

import { buildBaseMessage } from "utils/chat";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import { useUser } from "./useUser";

export const useVenuePoll = () => {
  const { spaceId } = useWorldAndSpaceByParams();

  const { userWithId } = useUser();

  const voteInPoll = useCallback(
    async (pollVote: PollVoteBase) => {
      if (!spaceId) return;

      return voteInVenuePoll({ pollVote, venueId: spaceId });
    },
    [spaceId]
  );

  const createPoll = useCallback(
    async (pollValues: PollValues) => {
      if (!spaceId || !userWithId) return;

      const message = buildBaseMessage<PollMessage>("poll", userWithId, {
        poll: pollValues,
        type: ChatMessageType.poll,
        votes: [],
      });

      return sendVenueMessage({ venueId: spaceId, message });
    },
    [spaceId, userWithId]
  );

  return useMemo(
    () => ({
      createPoll,
      voteInPoll,
    }),
    [createPoll, voteInPoll]
  );
};
