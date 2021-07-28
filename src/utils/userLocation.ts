import firebase from "firebase/app";

import { LOCATION_INCREMENT_MS, LOCATION_INCREMENT_SECONDS } from "settings";

import { useInterval } from "hooks/useInterval";

import { updateUserProfile } from "pages/Account/helpers";

import { getCurrentTimeInMilliseconds } from "./time";
import { logEventGoogleAnalytics } from "./googleAnalytics";
import { openRoomUrl } from "./url";

export type LocationData = Record<string, number>;

export interface UpdateLocationDataProps {
  userId: string;
  newLocationData: LocationData;
}

export const updateLocationData = ({
  userId,
  newLocationData,
}: UpdateLocationDataProps) => {
  updateUserProfile(userId, {
    lastSeenAt: getCurrentTimeInMilliseconds(),
    lastSeenIn: newLocationData,
  });
};

export interface SetLocationDataProps {
  userId: string;
  locationName: string;
}

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

// @debt user location updates when there are tons of users cause a constant stream of updates that hurt platform performance
//   hacking this out will lead to 'counting issues' if users stay in a single location for a long time without going anywhere,
//   and may lead to them being 'filtered out' of recent location users if they have been sitting around too long without another
//   form of update
// export interface UpdateCurrentLocationDataProps {
//   userId: string;
//   profileLocationData: LocationData;
// }
//
// NOTE: The intended effect is to update the current location, without rewriting it.
// profileLocationData can only have 1 key at any point of time
// export const updateCurrentLocationData = ({
//   userId,
//   profileLocationData,
// }: UpdateCurrentLocationDataProps) => {
//   const [locationName] = Object.keys(profileLocationData);
//
//   updateLocationData({
//     userId,
//     newLocationData: { [locationName]: getCurrentTimeInMilliseconds() },
//   });
// };

export const clearLocationData = (userId: string) => {
  updateLocationData({ userId, newLocationData: {} });
};

export interface EnterExternalRoomProps {
  userId: string;
  roomUrl: string;
  locationName: string;
}

export const enterExternalRoom = ({
  userId,
  locationName,
  roomUrl,
}: EnterExternalRoomProps) => {
  setLocationData({
    userId,
    locationName,
  });

  logEventGoogleAnalytics({
    eventName: "ENTER_THIRD_PARTY_ROOM",
    eventAction: {
      locationName,
      userId,
      roomUrl,
    },
  });

  openRoomUrl(roomUrl);
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
