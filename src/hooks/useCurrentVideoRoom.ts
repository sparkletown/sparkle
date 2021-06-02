import {
  currentVideoRoomSelector,
  isCurrentVideoRoomRequestedSelector,
} from "utils/selectors";

import { useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";

export const useCurrentVideoRoom = (roomId: string) => {
  useFirestoreConnect([
    {
      collection: "videoRooms",
      doc: roomId,
      storeAs: "currentVideoRoom",
    },
  ]);

  const currentVideoRoom = useSelector(currentVideoRoomSelector);
  const isLoadingCurrentVideoRoom = useSelector(
    isCurrentVideoRoomRequestedSelector
  );

  return {
    videoRoom: currentVideoRoom,
    isLoading: isLoadingCurrentVideoRoom,
  };
};
