import firebase from "firebase/app";

import { LOCATION_INCREMENT_MS, LOCATION_INCREMENT_SECONDS } from "settings";

import { useInterval } from "hooks/useInterval";

import { updateUserProfile } from "pages/Account/helpers";

import { getCurrentTimeInMilliseconds } from "./time";

export type LocationData = string | null;

export interface UpdateLocationDataProps {
  userId: string;
  newLocationPath: LocationData;
}

export const updateLocationData = ({
  userId,
  newLocationPath,
}: UpdateLocationDataProps) => {
  updateUserProfile(userId, {
    lastSeenAt: getCurrentTimeInMilliseconds(),
    lastVenueIdSeenIn: newLocationPath,
  });
};

// TODO: refactor how user location updates works here?
//   Called from VenuePage useEffect + onBeforeUnloadHandler
export const clearLocationData = (userId: string) => {
  updateLocationData({ userId, newLocationPath: null });
};

export interface UseUpdateTimespentPeriodicallyProps {
  locationName: string;
  userId?: string;
}

// @debt I don't think this functionality works correctly, since we only log 'internal venues' in this piece of code
//   Could also be beneficial to log external rooms' timespent
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
      const locationRef = firestore
        .collection("users")
        .doc(userId)
        .collection("visits")
        .doc(locationName);

      return locationRef
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
          locationRef.set({ timeSpent: LOCATION_INCREMENT_SECONDS });
        });
    },
    shouldUseInterval ? LOCATION_INCREMENT_MS : undefined
  );
};
