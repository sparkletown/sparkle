import { videoRoomInvitesSelector } from "utils/selectors";

import { useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";
import { useUser } from "./useUser";

export const useConnectVideoRooms = () => {
  const { user } = useUser();

  useFirestoreConnect([
    {
      collection: "videoRooms",
      where: [["invitedUserIds", "array-contains", user?.uid]],
      storeAs: "videoRooms",
    },
  ]);

  const videoRoomInvites = useSelector(videoRoomInvitesSelector);

  return videoRoomInvites;
};
