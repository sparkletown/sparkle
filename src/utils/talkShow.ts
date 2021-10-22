import { pick } from "lodash";

import { TalkShowStudioUser, User } from "types/User";

import { pickDisplayUserFromUser } from "./chat";
import { WithId } from "./id";

export const getTalkShowStudioUser = (
  user: WithId<User>
): WithId<TalkShowStudioUser> => {
  const displayUser = pickDisplayUserFromUser(user);
  const talkShowStudioUser = pick(
    user,
    "place",
    "isSharingScreen",
    "isMuted",
    "isUserCameraOff",
    "cameraClientUid",
    "screenClientUid"
  );

  return Object.assign(talkShowStudioUser, displayUser);
};
