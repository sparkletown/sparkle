import { useEffect } from "react";
import firebase, { UserInfo } from "firebase/app";

import { updateUserProfile } from "pages/Account/helpers";

const LOCATION_INCREMENT_SECONDS = 10;

export const updateLocationData = (
  user: UserInfo,
  roomName: any,
  lastSeenIn: { [key: string]: string } | undefined
) => {
  const room = roomName ?? {};
  updateUserProfile(user.uid, {
    lastSeenAt: new Date().getTime() / 1000,
    lastSeenIn:
      !roomName && !lastSeenIn
        ? null
        : lastSeenIn
        ? { ...lastSeenIn, ...room }
        : room,
    room: !roomName && !lastSeenIn ? null : roomName,
  });
};

// get Profile from the firebase
export const enterRoom = (
  user: UserInfo,
  roomName: string,
  lastSeenIn: { [key: string]: string } | undefined
) => {
  updateLocationData(user, roomName, lastSeenIn);
};
export const leaveRoom = (user: UserInfo) => {
  updateUserProfile(user.uid, {
    lastSeenAt: 0,
    lastSeenIn: null,
    room: null,
  });
};

export const useLocationUpdateEffect = (
  user: UserInfo | undefined,
  roomName: string
) => {
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
