import firebase, { UserInfo } from "firebase/app";

import { Room } from "types/rooms";
import { AnyVenue, VenueEvent } from "types/venues";
import { User } from "types/User";

import { updateUserProfile } from "pages/Account/helpers";
import { useInterval } from "hooks/useInterval";

import { WithId } from "./id";
import { getCurrentTimeInMilliseconds } from "./time";
import { openRoomUrl, openUrl, venueInsideUrl } from "./url";

const LOCATION_INCREMENT_SECONDS = 10;
const LOCATION_INCREMENT_MS = LOCATION_INCREMENT_SECONDS * 1000;

export const updateLocationData = (
  user: UserInfo,
  locationName: { [key: string]: number },
  lastSeenIn: { [key: string]: number } | undefined
) => {
  const location = locationName ?? {};
  const prevRoomName =
    lastSeenIn &&
    Object.keys(lastSeenIn).find((lastSeen) => lastSeen.includes("/"));

  if (lastSeenIn && prevRoomName) {
    delete lastSeenIn[prevRoomName];
  }

  const roomVenue =
    locationName && Object.keys(locationName).length
      ? Object.keys(locationName)[0]
      : null;

  updateUserProfile(user.uid, {
    lastSeenAt: getCurrentTimeInMilliseconds(),
    lastSeenIn:
      !locationName && !lastSeenIn
        ? null
        : lastSeenIn
        ? { ...lastSeenIn, ...location }
        : location,
    room: !locationName && !lastSeenIn ? null : roomVenue,
  });
};

// get Profile from the firebase
// @debt rename this trackLocationEntered?
export const trackRoomEntered = (
  user: UserInfo,
  locationName: { [key: string]: number },
  lastSeenIn: { [key: string]: number } | undefined
) => {
  updateLocationData(user, locationName, lastSeenIn);
};

export interface TrackRoomEnteredNGProps {
  user?: UserInfo;
  venue: AnyVenue;
  room: Room;
  lastSeenIn?: Record<string, number>;
}

export const trackRoomEnteredNG = ({
  user,
  venue,
  room,
  lastSeenIn,
}: TrackRoomEnteredNGProps) => {
  if (!user) return;

  trackRoomEntered(
    user,
    { [`${venue.name}/${room.title}`]: getCurrentTimeInMilliseconds() },
    lastSeenIn
  );
};

export interface TrackVenueEnteredProps {
  user?: UserInfo;
  venue: AnyVenue;
  lastSeenIn?: Record<string, number>;
}

export const trackVenueEntered = ({
  user,
  venue,
  lastSeenIn,
}: TrackVenueEnteredProps) => {
  if (!user) return;

  trackRoomEntered(
    user,
    { [venue.name]: getCurrentTimeInMilliseconds() },
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
  room?: Room;
}

export const openRoomWithCounting = ({
  user,
  profile,
  venue,
  room,
}: EnterRoomWithCounting) => {
  if (!room) {
    trackVenueEntered({
      user,
      venue,
      lastSeenIn: profile?.lastSeenIn,
    });

    openUrl(venueInsideUrl(venue.id));
    return;
  }

  // Track room counting
  trackRoomEnteredNG({
    user,
    venue,
    room,
    lastSeenIn: profile?.lastSeenIn,
  });

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
  const shouldUseInterval = user && roomName;

  useInterval(
    () => {
      // Time spent is currently counted multiple time if multiple tabs are open
      if (!user || !roomName) return;

      const firestore = firebase.firestore();
      const doc = `users/${user.uid}/visits/${roomName}`;
      const increment = firebase.firestore.FieldValue.increment(
        LOCATION_INCREMENT_SECONDS
      );

      return firestore
        .doc(doc)
        .update({ timeSpent: increment })
        .catch(() => {
          firestore.doc(doc).set({ timeSpent: LOCATION_INCREMENT_SECONDS });
        });
    },
    shouldUseInterval ? LOCATION_INCREMENT_MS : undefined
  );
};
