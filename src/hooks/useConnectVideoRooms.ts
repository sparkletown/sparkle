import { videoRoomInvitesSelector } from "utils/selectors";

import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { VideoChatRequestState } from "types/VideoRoom";

// const INVITE_EXPIRATION = 300000

export const useConnectVideoRooms = () => {
  const { user } = useUser();

  // const inviteExpirationDate = Date.now() - INVITE_EXPIRATION

  useFirestoreConnect([
    {
      collection: "videoRooms",
      where: [
        ["invitedUserIds", "array-contains", user?.uid],
        ["state", "==", VideoChatRequestState.Invited],
      ],
      storeAs: "videoRoomInvites",
    },
  ]);

  const videoRoomInvites = useSelector(videoRoomInvitesSelector);

  return videoRoomInvites;
};
