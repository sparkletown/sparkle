import Bugsnag from "@bugsnag/js";
import noop from "lodash/noop";

import { PollMessage, PollQuestion } from "types/chat";

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
        console.log(err, event, poll);
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

export const deleteVenuePoll = async ({
  venueId,
  pollId,
}: DeleteVenuePollProps): Promise<void> =>
  await getVenueRef(venueId)
    .collection("chats")
    .doc(pollId)
    .update({ deleted: true })
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        console.log(err, event, pollId);
        event.addMetadata("context", {
          location: "api/chat::deleteVenuePoll",
          venueId,
          pollId,
        });
      });
      // @debt rethrow error, when we can handle it to show UI error
    });

export type VoteInPollProps = {
  venueId: string;
  question: PollQuestion;
};
export const voteInVenuePoll = async ({
  venueId,
  question,
}: VoteInPollProps): Promise<void> =>
  console.log("voteInVenuePoll: ", venueId, question);
