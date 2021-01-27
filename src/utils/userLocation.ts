import firebase, { UserInfo } from "firebase/app";
import { isEmpty } from "lodash";

import { AnyRoom } from "types/rooms";
import { AnyVenue, VenueEvent } from "types/venues";
import { User } from "types/User";

import { updateUserProfile } from "pages/Account/helpers";
import { useInterval } from "hooks/useInterval";

import { WithId } from "./id";
import { getCurrentTimeInMilliseconds } from "./time";
import { openRoomUrl, openUrl, venueInsideUrl } from "./url";

const LOCATION_INCREMENT_SECONDS = 10;
const LOCATION_INCREMENT_MS = LOCATION_INCREMENT_SECONDS * 1000;

type LocationData = Record<string, number>;

export const updateLocationData = (
  userId: string,
  newLocationData: LocationData = {},
  oldLocationData: LocationData | undefined
) => {
  const prevRoomName =
    oldLocationData &&
    Object.keys(oldLocationData).find((lastSeen) => lastSeen.includes("/"));

  if (oldLocationData && prevRoomName) {
    delete oldLocationData[prevRoomName];
  }

  updateUserProfile(userId, {
    lastSeenAt: getCurrentTimeInMilliseconds(),
    lastSeenIn: { ...oldLocationData, ...newLocationData }
  });
};

export interface TrackLocationProps {
  userId: string;
  locationName: string,
  lastSeenIn?: LocationData;
}

const trackLocationEntered = ({
  userId,
  locationName,
  lastSeenIn,
}: TrackLocationProps) => {
  updateLocationData(
    userId,
    { [locationName]: getCurrentTimeInMilliseconds() },
    lastSeenIn
  );
}

export const deleteLocationData = (userId: string) => {
  updateUserProfile(userId, {
    lastSeenAt: 0,
    lastSeenIn: {},
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

export const enterSparkleRoom = ({
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

};

export const enterExternalRoom = () => {
  trackRoomEnteredNG({
    user.uid,
    venue,
    room,
    lastSeenIn: profile?.lastSeenIn,
  });

  openRoomUrl(room.url);
  }

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

export const setUpdateTimeSpentInterval = (
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
