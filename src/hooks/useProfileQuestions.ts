import { useMemo } from "react";

import { User } from "types/User";

import { useWorldById } from "hooks/worlds/useWorldById";

export const useProfileQuestions = (user?: User, worldId?: string) => {
  const { world } = useWorldById({ worldId });

  const questions = world?.questions?.profile;
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
