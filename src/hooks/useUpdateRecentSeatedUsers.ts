import { useInterval } from "react-use";
import firebase from "firebase/app";
import { FalseyValue } from "styled-components";

import {
  ALWAYS_EMPTY_OBJECT,
  VENUE_RECENT_SEATED_USERS_UPDATE_INTERVAL,
} from "settings";

import {
  RecentSeatedUserData,
  RecentSeatedUserTimestamp,
  TableSeatedUsersVenuesTemplates,
  VenueTemplate,
} from "types/venues";

import { getCurrentTimeInMilliseconds } from "utils/time";

import { useUser } from "hooks/useUser";

export const useUpdateRecentSeatedUsers = <T extends VenueTemplate>(
  template: T,
  venueId: string | undefined,
  venueSpecificData: RecentSeatedUserData<T>["venueSpecificData"] | FalseyValue
) => {
  const { userId } = useUser();

  useInterval(() => {
    if (!venueSpecificData || !venueId) return;

    const withTimestamp: RecentSeatedUserTimestamp<T> = {
      template,
      venueId,
      venueSpecificData,
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

export const useUpdateRecentSeatedTableUsers = (
  template: TableSeatedUsersVenuesTemplates,
  venueId: string | undefined
) => {
  useUpdateRecentSeatedUsers(template, venueId, ALWAYS_EMPTY_OBJECT);
};
