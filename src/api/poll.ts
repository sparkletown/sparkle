import firebase from "firebase/app";
import Bugsnag from "@bugsnag/js";
import noop from "lodash/noop";

import { PollMessage, Vote } from "types/chat";

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

export type DeleteVenuePollProps = {
  venueId: string;
  pollId: string;
};

export const deleteVenuePoll = async (data: DeleteVenuePollProps) =>
  await firebase.functions().httpsCallable("venue-deletePollInVenue")(data);

export type VoteInPollProps = {
  venueId: string;
  votes: Vote[];
  pollId: string;
};

export const voteInVenuePoll = async (data: VoteInPollProps) =>
  await firebase.functions().httpsCallable("venue-voteInPoll")(data);
