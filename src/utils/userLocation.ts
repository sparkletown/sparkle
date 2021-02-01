import firebase from "firebase/app";

import { AnyRoom } from "types/rooms";

import { updateUserProfile } from "pages/Account/helpers";
import { useInterval } from "hooks/useInterval";

import { getCurrentTimeInMilliseconds } from "./time";
import { openRoomUrl } from "./url";

const LOCATION_INCREMENT_SECONDS = 10;
const LOCATION_INCREMENT_MS = LOCATION_INCREMENT_SECONDS * 1000;

type LocationData = Record<string, number>;

type UpdateLocationDataProps = {
  userId: string;
  newLocationData: LocationData;
};

export const updateLocationData = ({
  userId,
  newLocationData,
}: UpdateLocationDataProps) => {
  updateUserProfile(userId, {
    lastSeenAt: getCurrentTimeInMilliseconds(),
    lastSeenIn: newLocationData,
  });
};

type SetNewLocationDataProps = {
  userId: string;
  locationName: string;
  lastSeenIn?: LocationData;
};

export const setNewLocationData = ({
  userId,
  locationName,
}: SetNewLocationDataProps) => {
  updateLocationData({
    userId,
    newLocationData: {
      [locationName]: getCurrentTimeInMilliseconds(),
    },
  });
};

type UpdateCurrentLocationDataProps = {
  userId: string;
  profileLocationData: LocationData;
};

export const updateCurrentLocationData = ({
  userId,
  profileLocationData,
}: UpdateCurrentLocationDataProps) => {
  const [locationName] = Object.keys(profileLocationData);

  updateLocationData({
    userId,
    newLocationData: { [locationName]: getCurrentTimeInMilliseconds() },
  });
};

type ClearLocationData = {
  userId: string;
};

export const clearLocationData = ({ userId }: ClearLocationData) => {
  updateLocationData({ userId, newLocationData: {} });
};

type EnterExternalRoomProps = {
  userId: string;
  room: AnyRoom;
};

export const enterExternalRoom = ({ userId, room }: EnterExternalRoomProps) => {
  setNewLocationData({
    userId,
    locationName: room.url,
  });

  openRoomUrl(room.url);
};

export const useUpdateTimespentPeriodically = (
  roomName: string,
  userId?: string
) => {
  const shouldUseInterval = userId && roomName;

  useInterval(
    () => {
      // @debt time spent is currently counted multiple time if multiple tabs are open
      if (!userId || !roomName) return;

      const firestore = firebase.firestore();
      const doc = `users/${userId}/visits/${roomName}`;

      return firestore
        .doc(doc)
        .update({
          timeSpent: firebase.firestore.FieldValue.increment(
            LOCATION_INCREMENT_SECONDS
          ),
        })
        .catch(() => {
          /*
            NOTE: it's (intended to be) because there was no document to update,
            and so we are defaulting it to LOCATION_INCREMENT_SECONDS
            since that's how often this code runs
          */
          firestore.doc(doc).set({ timeSpent: LOCATION_INCREMENT_SECONDS });
        });
    },
    shouldUseInterval ? LOCATION_INCREMENT_MS : undefined
  );
};
