import { useEffect } from "react";
import firebase, { UserInfo } from "firebase";

import { updateUserProfile } from "pages/Account/helpers";

const LOCATION_INCREMENT_SECONDS = 10;

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

export const useLocationUpdateEffect = (
  user: UserInfo | undefined,
  roomName: string
) => {
  useEffect(() => {
    if (!user || !roomName) return;

    updateLocationData(user, roomName);
    const intervalId = setInterval(
      () => updateLocationData(user, roomName),
      5 * 60 * 1000
    );

    return () => clearInterval(intervalId);
  }, [user, roomName]);

  useEffect(() => {
    // Time spent is currently counted multiple time if multiple tabs are open
    if (!user || !roomName) return;

    const firestore = firebase.firestore();
    const doc = `users/${user.uid}/visits/${roomName}`;
    const increment = firebase.firestore.FieldValue.increment(
      LOCATION_INCREMENT_SECONDS
    );

    const intervalId = setInterval(() => {
      return firestore
        .doc(doc)
        .update({ timeSpent: increment })
        .catch(() => {
          firestore.doc(doc).set({ timeSpent: LOCATION_INCREMENT_SECONDS });
        });
    }, LOCATION_INCREMENT_SECONDS * 1000);
    return () => clearInterval(intervalId);
  }, [user, roomName]);
};
