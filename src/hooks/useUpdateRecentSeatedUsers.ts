import { useEffect, useMemo } from "react";
import { useInterval } from "react-use";
import firebase from "firebase/compat/app";

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

const getRecentSeatedUserRef = (venueId: string, userId: string) =>
  firebase
    .firestore()
    .collection("venues")
    .doc(venueId)
    .collection("recentSeatedUsers")
    .doc(userId);

const updateSeatedData = async <T extends VenueTemplate>(
  template: T,
  venueId: string | undefined,
  userId: string | undefined,
  venueSpecificData:
    | RecentSeatedUserData<T>["venueSpecificData"]
    | undefined
    | null
    | false
) => {
  if (!venueSpecificData || !venueId || !userId) return;

  const withTimestamp: RecentSeatedUserTimestamp<T> = {
    template,
    venueId,
    venueSpecificData,
    lastSittingTimeMs: getCurrentTimeInMilliseconds(),
  };

  return getRecentSeatedUserRef(venueId, userId).set(withTimestamp);
};

const useUpdateRecentSeatedUsers = <T extends VenueTemplate>(
  template: T,
  venueId: string | undefined,
  venueSpecificData:
    | RecentSeatedUserData<T>["venueSpecificData"]
    | undefined
    | null
    | false
) => {
  const { userId } = useUser();

  const intervalRunning = Boolean(venueSpecificData && venueId);
  useInterval(
    () => {
      void updateSeatedData(template, venueId, userId, venueSpecificData);
    },
    intervalRunning ? VENUE_RECENT_SEATED_USERS_UPDATE_INTERVAL : null
  );

  useEffect(() => {
    void updateSeatedData(template, venueId, userId, venueSpecificData);

    return () => {
      if (venueId && userId)
        void getRecentSeatedUserRef(venueId, userId).delete();
    };
  }, [template, userId, venueId, venueSpecificData]);
};

export const useUpdateAuditoriumRecentSeatedUsers = (
  venueId: string | undefined,
  sectionId: string | undefined | null | false
) => {
  useUpdateRecentSeatedUsers(
    VenueTemplate.auditorium,
    venueId,
    useMemo(() => (sectionId ? { sectionId } : undefined), [sectionId])
  );
};

export const useUpdateTableRecentSeatedUsers = (
  template: TableSeatedUsersVenuesTemplates,
  venueId: string | undefined
) => {
  useUpdateRecentSeatedUsers(template, venueId, ALWAYS_EMPTY_OBJECT);
};
