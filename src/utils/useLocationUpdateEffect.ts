import { useEffect } from "react";
import firebase, { UserInfo } from "firebase/app";

import { updateUserProfile } from "pages/Account/helpers";
import { currentTimeInUnixEpoch } from "./time";

const LOCATION_INCREMENT_SECONDS = 10;

export const updateLocationData = (
  user: UserInfo,
  roomName: { [key: string]: number },
  lastSeenIn: { [key: string]: number } | undefined
) => {
  const room = roomName ?? {};
  const roomVenue =
    roomName && Object.keys(roomName).length ? Object.keys(roomName)[0] : null;
  updateUserProfile(user.uid, {
    lastSeenAt: currentTimeInUnixEpoch,
    lastSeenIn:
      !roomName && !lastSeenIn
        ? null
        : lastSeenIn
        ? { ...lastSeenIn, ...room }
        : room,
    room: !roomName && !lastSeenIn ? null : roomVenue,
  });
};

// get Profile from the firebase
export const enterRoom = (
  user: UserInfo,
  roomName: { [key: string]: number },
  lastSeenIn: { [key: string]: number } | undefined
) => {
  updateLocationData(user, roomName, lastSeenIn);
};

export const leaveRoom = (user: UserInfo) => {
  updateUserProfile(user.uid, {
    lastSeenAt: 0,
    lastSeenIn: {},
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
