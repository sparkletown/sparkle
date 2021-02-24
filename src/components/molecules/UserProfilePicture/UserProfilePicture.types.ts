import { User } from "types/User";
import { WithId } from "utils/id";

// @debt follow our standard patterns and move this back into ./UserProfilePicture.tsx
export interface UserProfilePictureProp {
  user: WithId<User>;
  setSelectedUserProfile: (user: WithId<User>) => void;

  isAudioEffectDisabled?: boolean;
  miniAvatars?: boolean;
  avatarClassName?: string;
  avatarStyle?: object;
  containerStyle?: object;
  reactionPosition?: "right" | "left" | undefined;
}
