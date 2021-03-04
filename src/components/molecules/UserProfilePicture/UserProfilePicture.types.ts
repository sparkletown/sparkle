import { User } from "types/User";
import { WithId } from "utils/id";

export interface UserProfilePictureProp {
  isAudioEffectDisabled?: boolean;
  miniAvatars?: boolean;
  avatarClassName?: string;
  avatarStyle?: object;
  containerStyle?: object;
  user: WithId<User>;
  reactionPosition?: "right" | "left" | undefined;
}
