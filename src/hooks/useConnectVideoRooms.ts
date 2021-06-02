import { videoRoomInvitesSelector } from "utils/selectors";

import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

import { VideoChatRequestState } from "types/VideoRoom";

export const useConnectVideoRooms = () => {
  const { user } = useUser();

  useFirestoreConnect([
    {
      collection: "videoRooms",
      where: [
        ["invitedUserId", "==", user?.uid],
        ["state", "==", VideoChatRequestState.Invited],
      ],
      storeAs: "videoRoomInvites",
    },
  ]);

  const videoRoomInvites = useSelector(videoRoomInvitesSelector);

  return videoRoomInvites;
};
