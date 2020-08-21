import { useEffect } from "react";
import { UserInfo } from "firebase";

import { updateUserProfile } from "pages/Account/helpers";

export const updateLocationData = (user: UserInfo, roomName: string | null) => {
  updateUserProfile(user.uid, {
    lastSeenAt: new Date().getTime() / 1000,
    lastSeenIn: roomName,
    room: roomName,
  });
};

export const enterRoom = (user: UserInfo, roomName: string) => {
  updateLocationData(user, roomName);
};
export const leaveRoom = (user: UserInfo) => {
  updateLocationData(user, null);
};

const useLocationUpdateEffect = (
  user: UserInfo | undefined,
  roomName: string
) => {
  useEffect(() => {
    if (!user || !roomName) return;

    updateLocationData(user, roomName);
    const intervalId = setInterval(
      () => updateLocationData(user, roomName),
      60 * 1000
    );

    return () => clearInterval(intervalId);
  }, [user, roomName]);
};

export default useLocationUpdateEffect;
