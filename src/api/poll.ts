import firebase from "firebase/app";
import Bugsnag from "@bugsnag/js";
import noop from "lodash/noop";

import { PollMessage, PollValues } from "types/chat";

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

export const deleteVenuePoll = async (data: DeleteVenuePollProps) => {
  return await firebase.functions().httpsCallable("venue-deletePollInVenue")(
    data
  );
};

export type VoteInPollProps = {
  venueId: string;
  poll: PollValues;
  votes: string[];
  pollId: string;
};

// RESTRICRED due to user rights issue
export const voteInVenuePoll = async ({
  venueId,
  poll,
  votes,
  pollId,
}: VoteInPollProps): Promise<void> =>
  getVenueRef(venueId)
    .collection("chats")
    .doc(pollId)
    .update({ votes, poll })
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/chat::voteInVenuePoll",
          venueId,
          poll,
          pollId,
        });
      });
      // @debt rethrow error, when we can handle it to show UI error
    });
