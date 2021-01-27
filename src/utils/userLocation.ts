import firebase, { UserInfo } from "firebase/app";
import { isArray, isEmpty } from "lodash";

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
  newLocationData: LocationData = {}
) => {
  updateUserProfile(userId, {
    lastSeenAt: getCurrentTimeInMilliseconds(),
    lastSeenIn: newLocationData,
  });
};

export interface TrackLocationProps {
  userId: string;
  locationName: string;
  lastSeenIn?: LocationData;
}

const trackLocationEntered = ({ userId, locationName }: TrackLocationProps) => {
  updateLocationData(userId, {
    [locationName]: getCurrentTimeInMilliseconds(),
  });
};

export interface BaseEnterRoomWithCountingProps {
  user: User;
  profile?: User;
  venue: WithId<AnyVenue>;
}

export interface EnterRoomWithCounting extends BaseEnterRoomWithCountingProps {
  room?: AnyRoom;
}

type EnterVenueRoomProps = {
  userId: string;
  venueId: string;
  venueName: string;
};

export const enterVenueRoom = ({
  userId,
  venueName,
  venueId,
}: EnterVenueRoomProps) => {
  trackLocationEntered({
    userId,
    locationName: venueName,
  });
  openUrl(venueInsideUrl(venueId));
};

type EnterExternalRoomProps = {
  userId: string;
  room: AnyRoom;
};

export const enterExternalRoom = ({ userId, room }: EnterExternalRoomProps) => {
  trackLocationEntered({
    userId,
    locationName: `external/${room.title}`,
  });

  openRoomUrl(room.url);
};

export interface EnterEventRoomWithCounting
  extends BaseEnterRoomWithCountingProps {
  event: VenueEvent;
}

export const openEventRoomWithCounting = () => {
  // const room = venue?.rooms?.find((room) => room.title === event.room);
  // openRoomWithCounting({ user, profile, venue, room });
};

export const useUpdateTimespentPeriodically = (
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
