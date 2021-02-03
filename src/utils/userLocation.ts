import firebase from "firebase/app";

import { updateUserProfile } from "pages/Account/helpers";
import { useInterval } from "hooks/useInterval";

import { LOCATION_INCREMENT_MS, LOCATION_INCREMENT_SECONDS } from "settings";

import { getCurrentTimeInMilliseconds } from "./time";
import { openRoomUrl } from "./url";

export type LocationData = Record<string, number>;

export type UpdateLocationDataProps = {
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

export type SetLocationDataProps = {
  userId: string;
  locationName: string;
};

export const setLocationData = ({
  userId,
  locationName,
}: SetLocationDataProps) => {
  updateLocationData({
    userId,
    newLocationData: {
      [locationName]: getCurrentTimeInMilliseconds(),
    },
  });
};

export type UpdateCurrentLocationDataProps = {
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

export const clearLocationData = (userId: string) => {
  updateLocationData({ userId, newLocationData: {} });
};

export type EnterExternalRoomProps = {
  userId: string;
  roomUrl: string;
  roomId: string;
};

export const enterExternalRoom = ({
  userId,
  roomId,
  roomUrl,
}: EnterExternalRoomProps) => {
  setLocationData({
    userId,
    locationName: roomId,
  });

  openRoomUrl(roomUrl);
};

export type UseUpdateTimespentPeriodicallyProps = {
  locationName: string;
  userId?: string;
};

// @dept I don't think this functinality works correctly, since we only log `internal venues` in this piece of code
// Could be also beneficial to log external rooms' timespent
export const useUpdateTimespentPeriodically = ({
  locationName,
  userId,
}: UseUpdateTimespentPeriodicallyProps) => {
  const shouldUseInterval = userId && locationName;

  useInterval(
    () => {
      // @debt time spent is currently counted multiple times if multiple tabs are open
      if (!userId || !locationName) return;

      const firestore = firebase.firestore();

      return firestore
        .collection("users")
        .doc(userId)
        .collection("visits")
        .doc(locationName)
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
          firestore
            .collection("users")
            .doc(userId)
            .collection("visits")
            .doc(locationName)
            .set({ timeSpent: LOCATION_INCREMENT_SECONDS });
        });
    },
    shouldUseInterval ? LOCATION_INCREMENT_MS : undefined
  );
};
