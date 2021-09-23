import { useInterval } from "react-use";
import firebase from "firebase/compat/app";

import { VENUE_RECENT_SEATED_USERS_UPDATE_INTERVAL } from "settings";

import {
  RecentSeatedUserData,
  RecentSeatedUserTimestamp,
  VenueTemplate,
} from "types/venues";

import { getCurrentTimeInMilliseconds } from "utils/time";

import { useUser } from "hooks/useUser";

export const useUpdateRecentSeatedUsers = <T extends VenueTemplate>(
  data: RecentSeatedUserData<T> | undefined
) => {
  const { userId } = useUser();

  useInterval(() => {
    if (!data) return;

    const venueId = data.venueId;

    const withTimestamp: RecentSeatedUserTimestamp<T> = {
      ...data,
      lastSittingTimeMs: getCurrentTimeInMilliseconds(),
    };

    void firebase
      .firestore()
      .collection("venues")
      .doc(venueId)
      .collection("recentSeatedUsers")
      .doc(userId)
      .set(withTimestamp);
  }, VENUE_RECENT_SEATED_USERS_UPDATE_INTERVAL);
};
