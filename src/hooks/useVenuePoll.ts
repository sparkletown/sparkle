import { useCallback, useMemo } from "react";

import { sendVenueMessage, voteInVenuePoll } from "api/chat";

import {
  ChatMessageType,
  PollMessage,
  PollValues,
  PollVoteBase,
} from "types/chat";

import { buildBaseMessage } from "utils/chat";

import { useSpaceBySlug } from "./spaces/useSpaceBySlug";
import { useUser } from "./useUser";
import { useSpaceParams } from "./useVenueId";

export const useVenuePoll = () => {
  const spaceSlug = useSpaceParams();
  const { space } = useSpaceBySlug(spaceSlug);
  const venueId = space?.id;

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

      const message = buildBaseMessage<PollMessage>("poll", userWithId, {
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
