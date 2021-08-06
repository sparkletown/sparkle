import { useSovereignVenue } from "hooks/useSovereignVenue";
import { useMemo } from "react";
import { User } from "types/User";

export const useProfileQuestions = (user?: User, venueId?: string) => {
  const { sovereignVenue } = useSovereignVenue({ venueId });
  const questions = sovereignVenue?.profile_questions;
  const answers = useMemo(
    // @ts-ignore User type doesn't accept string indexing.
    // We need to rework the way we store answers to profile questions
    () => questions?.map((q) => user?.[q.name]) as string[] | undefined,
    [questions, user]
  );

  return useMemo(
    () => ({
      questions: questions ?? [],
      answers: answers ?? [],
    }),
    [answers, questions]
  );
};
