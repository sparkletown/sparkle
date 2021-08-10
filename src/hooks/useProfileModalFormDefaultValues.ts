import { useMemo } from "react";

import { DEFAULT_PARTY_NAME, DEFAULT_PROFILE_PIC } from "settings";

import {
  UserProfileModalFormData,
  UserProfileModalFormDataPasswords,
} from "types/profileModal";
import { User } from "types/User";
import { Question } from "types/venues";

import { WithId } from "utils/id";

export const useProfileModalFormDefaultValues: (
  user: WithId<User>,
  questions: Question[],
  answers: string[]
) => Omit<UserProfileModalFormData, keyof UserProfileModalFormDataPasswords> = (
  user,
  questions,
  answers
) =>
  useMemo(
    () => ({
      profileLinks: user.profileLinks ?? [],
      pictureUrl: user.pictureUrl ?? DEFAULT_PROFILE_PIC,
      partyName: user.partyName ?? DEFAULT_PARTY_NAME,
      ...(questions
        ? Object.assign(
            {},
            ...questions.map((q, i) => ({
              [q.name]: answers?.[i],
            }))
          )
        : {}),
    }),
    [answers, questions, user.partyName, user.pictureUrl, user.profileLinks]
  );
