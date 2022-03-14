import { DEFAULT_PARTY_NAME } from "settings";

import {
  UserProfileModalFormData,
  UserProfileModalFormDataPasswords,
} from "types/profileModal";
import { Question } from "types/Question";
import { User } from "types/User";

import { WithId } from "utils/id";
import { determineAvatar } from "utils/image";

export const useProfileModalFormDefaultValues: (
  user: WithId<User>,
  questions?: Question[],
  answers?: string[]
) => Omit<UserProfileModalFormData, keyof UserProfileModalFormDataPasswords> = (
  user,
  questions,
  answers
) => {
  if (!user) {
    return {};
  }

  return {
    profileLinks: user.profileLinks ?? [],
    pictureUrl: determineAvatar({ user }).src,
    partyName: user.partyName ?? DEFAULT_PARTY_NAME,
    ...(questions
      ? Object.assign(
          {},
          ...questions.map((q, i) => ({
            [q.name]: answers?.[i],
          }))
        )
      : {}),
  };
};
