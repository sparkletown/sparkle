import { useMemo } from "react";

import { User } from "types/User";

import { useRelatedVenues } from "./useRelatedVenues";

export const useProfileQuestions = (user?: User, venueId?: string) => {
  const { sovereignVenue } = useRelatedVenues();
  const questions = sovereignVenue?.profile_questions;
  const answers = useMemo(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
