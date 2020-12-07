import { useEffect } from "react";
import firebase, { UserInfo } from "firebase/app";

import { AnyRoom } from "types/Venue";
import { AnyVenue } from "types/Firestore";
import { User } from "types/User";
import { VenueEvent } from "types/VenueEvent";

import { updateUserProfile } from "pages/Account/helpers";
import { WithId } from "./id";
import { getCurrentTimeInUnixEpochSeconds } from "./time";
import { openRoomUrl, openUrl, venueInsideUrl } from "./url";

const LOCATION_INCREMENT_SECONDS = 10;

export const updateLocationData = (
  user: UserInfo,
  roomName: { [key: string]: number },
  lastSeenIn: { [key: string]: number } | undefined
) => {
  const room = roomName ?? {};
  const prevRoomName =
    lastSeenIn &&
    Object.keys(lastSeenIn).find((lastSeen) => lastSeen.includes("/"));

  if (lastSeenIn && prevRoomName) {
    delete lastSeenIn[prevRoomName];
  }

  const roomVenue =
    roomName && Object.keys(roomName).length ? Object.keys(roomName)[0] : null;

  updateUserProfile(user.uid, {
    lastSeenAt: getCurrentTimeInUnixEpochSeconds(),
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
// @debt rename this trackRoomEntered
export const enterRoom = (
  user: UserInfo,
  roomName: { [key: string]: number },
  lastSeenIn: { [key: string]: number } | undefined
) => {
  updateLocationData(user, roomName, lastSeenIn);
};

export interface TrackRoomEnteredNGProps {
  user: UserInfo;
  venueName: string;
  roomTitle: string;
  lastSeenIn?: Record<string, number>;
}

export const trackRoomEnteredNG = ({
  user,
  venueName,
  roomTitle,
  lastSeenIn,
}: TrackRoomEnteredNGProps) => {
  enterRoom(
    user,
    { [`${venueName}/${roomTitle}`]: getCurrentTimeInUnixEpochSeconds() },
    lastSeenIn
  );
};

export const leaveRoom = (user: UserInfo) => {
  updateUserProfile(user.uid, {
    lastSeenAt: 0,
    lastSeenIn: {},
    room: null,
  });
};

export interface BaseEnterRoomWithCountingProps {
  user?: UserInfo;
  profile?: User;
  venue: WithId<AnyVenue>;
}

export interface EnterRoomWithCounting extends BaseEnterRoomWithCountingProps {
  room?: AnyRoom;
}

export const openRoomWithCounting = ({
  user,
  profile,
  venue,
  room,
}: EnterRoomWithCounting) => {
  if (!room) {
    // TODO: @debt this isn't going to update counting at the moment
    openUrl(venueInsideUrl(venue.id));
    return;
  }

  if (user) {
    // Track room counting
    trackRoomEnteredNG({
      user,
      venueName: venue.name,
      roomTitle: room.title,
      lastSeenIn: profile?.lastSeenIn,
    });
  }

  openRoomUrl(room.url);
};

export interface EnterEventRoomWithCounting
  extends BaseEnterRoomWithCountingProps {
  event: VenueEvent;
}

export const openEventRoomWithCounting = ({
  user,
  profile,
  venue,
  event,
}: EnterEventRoomWithCounting) => {
  const room = venue?.rooms?.find((room) => room.title === event.room);

  openRoomWithCounting({ user, profile, venue, room });
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
