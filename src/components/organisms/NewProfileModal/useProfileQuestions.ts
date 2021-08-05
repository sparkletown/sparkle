import { useSovereignVenue } from "hooks/useSovereignVenue";
import { User } from "types/User";

export const useProfileQuestions = (user?: User, venueId?: string) => {
  const { sovereignVenue } = useSovereignVenue({ venueId });
  const questions = sovereignVenue?.profile_questions;
  // @ts-ignore User type doesn't accept string indexing.
  // We need to rework the way we store answers to profile questions
  const answers = questions?.map((q) => user?.[q.name]) as string[] | undefined;

  return {
    questions: questions ?? [],
    answers: answers ?? [],
  };
};
