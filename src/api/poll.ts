import firebase from "firebase/app";
import Bugsnag from "@bugsnag/js";
import noop from "lodash/noop";

import { PollMessage, VoteInPoll } from "types/chat";

import { getVenueRef } from "./venue";

export interface CreatePollProps {
  venueId: string;
  poll: PollMessage;
}

export const createVenuePoll = async ({
  venueId,
  poll,
}: CreatePollProps): Promise<void> =>
  getVenueRef(venueId)
    .collection("chats")
    .add(poll)
    .then(noop)
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/chat::createVenuePoll",
          venueId,
          poll,
        });
      });
      // @debt rethrow error, when we can handle it to show UI error
    });

export type VoteInPollProps = VoteInPoll & {
  venueId: string;
};

export const voteInVenuePoll = async (data: VoteInPollProps) =>
  await firebase.functions().httpsCallable("venue-voteInPoll")(data);
