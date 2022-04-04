import { DEFAULT_PARTY_NAME } from "settings";

import {
  UserProfileModalFormData,
  UserProfileModalFormDataPasswords,
} from "types/profileModal";
import { User } from "types/User";

import { WithId } from "utils/id";
import { determineAvatar } from "utils/image";

export const useProfileModalFormDefaultValues: (
  user: WithId<User>
) => Omit<UserProfileModalFormData, keyof UserProfileModalFormDataPasswords> = (
  user
) => {
  return {
    profileLinks: user.profileLinks ?? [],
    pictureUrl: determineAvatar({ user }).src,
    partyName: user.partyName ?? DEFAULT_PARTY_NAME,
  };
};
