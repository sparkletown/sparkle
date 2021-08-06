import {
  UserProfileModalFormData,
  UserProfileModalFormDataPasswords,
} from "components/organisms/NewProfileModal/utilities";
import { pick } from "lodash";
import { useMemo } from "react";
import { DEFAULT_PARTY_NAME, DEFAULT_PROFILE_PIC } from "settings";
import { User } from "types/User";
import { Question } from "types/venues";
import { WithId } from "utils/id";

export const arePasswordsNotEmpty = (
  passwords: UserProfileModalFormDataPasswords
) => Object.values(pick(passwords, passwordsFields)).some((x) => x);

const passwordsFields: (keyof UserProfileModalFormDataPasswords)[] = [
  "oldPassword",
  "newPassword",
  "confirmNewPassword",
];

export const useFormDefaultValues: (
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
