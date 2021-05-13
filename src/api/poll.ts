// import firebase from "firebase/app";

import { PollValues, PollQuestion } from "types/chat";

export interface CreatePollProps {
  venueId: string;
  data: PollValues;
}
export const createVenuePoll = async ({ venueId, data }: CreatePollProps) =>
  console.log("createPoll: ", venueId, data);
// await firebase
//   .firestore()
//   .collection("venues")
//   .doc(venueId)
//   .collection("chats")
//   .add(message);

export type DeleteVenuePollProps = {
  venueId: string;
  pollId: string;
};

export const deleteVenuePoll = async ({
  venueId,
  pollId,
}: DeleteVenuePollProps) => console.log("deleteVenuePoll: ", venueId, pollId);
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
export const voteInVenuePoll = async ({ venueId, question }: VoteInPollProps) =>
  console.log("voteInVenuePoll: ", venueId, question);
