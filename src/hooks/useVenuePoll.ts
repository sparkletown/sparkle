import { useMemo, useCallback } from "react";
import firebase from "firebase/app";

import { sendVenueMessage } from "api/chat";

import { PollMessage, PollValues, VoteInPoll } from "types/chat";

import { buildMessage } from "utils/chat";

import { useVenueId } from "./useVenueId";
import { useUser } from "./useUser";

export const useVenuePoll = () => {
  const venueId = useVenueId();
  const { userId } = useUser();

  const voteInPoll = useCallback(
    async (props: VoteInPoll) => {
      if (!venueId) return;

      await firebase.functions().httpsCallable("venue-voteInPoll")({
        ...props,
        venueId,
      });
    },
    [venueId]
  );

  const createPoll = useCallback(
    (pollValues: PollValues) => {
      if (!venueId || !userId) return;

      const message = buildMessage<PollMessage>({
        poll: pollValues,
        from: userId,
        text: "poll",
        votes: [],
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
