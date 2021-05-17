import { PollMessage, PollQuestion } from "types/chat";

// import { getVenueRef } from "./venue";

export interface CreatePollProps {
  venueId: string;
  poll: PollMessage;
}
export const createVenuePoll = async ({
  venueId,
  poll,
}: CreatePollProps): Promise<void> =>
  console.log("createPoll: ", venueId, poll);
// getVenueRef(venueId)
//   .collection("chats")
//   .add(message)

export type DeleteVenuePollProps = {
  venueId: string;
  pollId: string;
};

export const deleteVenuePoll = async ({
  venueId,
  pollId,
}: DeleteVenuePollProps): Promise<void> =>
  console.log("deleteVenuePoll: ", venueId, pollId);
// await firebase
//   .firestore()
//   .collection("venues")
//   .doc(venueId)
//   .collection("chats")
//   .doc(messageId)
//   .update({ deleted: true });

export type VoteInPollProps = {
  venueId: string;
  question: PollQuestion;
};
export const voteInVenuePoll = async ({
  venueId,
  question,
}: VoteInPollProps): Promise<void> =>
  console.log("voteInVenuePoll: ", venueId, question);
