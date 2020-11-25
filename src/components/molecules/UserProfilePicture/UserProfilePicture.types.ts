import { User } from "types/User";
import { WithId } from "utils/id";

export interface UserProfilePictureProp {
  isAudioEffectDisabled?: boolean;
  miniAvatars?: boolean;
  avatarClassName?: string;
  avatarStyle?: object;
  containerStyle?: object;
  setSelectedUserProfile: (user: WithId<User>) => void;
  user: WithId<User>;
  reactionPosition?: "right" | "left" | undefined;
}
