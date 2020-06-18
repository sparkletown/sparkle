import { useEffect } from "react";
import { User } from "firebase";

import { updateUserProfile } from "pages/Account/helpers";

export const updateLocationData = (user: User, roomName: string | null) => {
  updateUserProfile(user.uid, {
    lastSeenAt: new Date().getTime() / 1000,
    lastSeenIn: roomName,
    room: roomName,
  });
};

export const enterRoom = (user: User, roomName: string) => {
  updateLocationData(user, roomName);
};
export const leaveRoom = (user: User) => {
  updateLocationData(user, null);
};

const useLocationUpdateEffect = (user: User, roomName: string) => {
  useEffect(() => {
    if (!user) return;

    updateLocationData(user, roomName);
  }, [user, roomName]);
};

export default useLocationUpdateEffect;
