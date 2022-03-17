import { useEffect, useMemo } from "react";
import { useInterval } from "react-use";
import firebase from "firebase/compat/app";

import {
  ALWAYS_EMPTY_OBJECT,
  COLLECTION_SEATED_USERS_CHECKINS,
  COLLECTION_WORLDS,
  VENUE_RECENT_SEATED_USERS_UPDATE_INTERVAL,
} from "settings";

import {
  RecentSeatedUserData,
  RecentSeatedUserTimestamp,
  TableSeatedUsersVenuesTemplates,
} from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import { getCurrentTimeInMilliseconds } from "utils/time";

import { useUser } from "hooks/useUser";

const getRecentSeatedUserRef = (worldId: string, userId: string) =>
  firebase
    .firestore()
    .collection(COLLECTION_WORLDS)
    .doc(worldId)
    .collection(COLLECTION_SEATED_USERS_CHECKINS)
    .doc(userId);

const updateSeatedData = async <T extends VenueTemplate>(
  template: T,
  worldId: string,
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
    worldId,
    spaceId: venueId,
    venueSpecificData,
    lastSittingTimeMs: getCurrentTimeInMilliseconds(),
  };

  return getRecentSeatedUserRef(worldId, userId).set(withTimestamp);
};

const useUpdateRecentSeatedUsers = <T extends VenueTemplate>(
  template: T,
  worldId: string,
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
      void updateSeatedData(
        template,
        worldId,
        venueId,
        userId,
        venueSpecificData
      );
    },
    intervalRunning ? VENUE_RECENT_SEATED_USERS_UPDATE_INTERVAL : null
  );

  useEffect(() => {
    void updateSeatedData(
      template,
      worldId,
      venueId,
      userId,
      venueSpecificData
    );

    return () => {
      if (venueId && userId)
        void getRecentSeatedUserRef(venueId, userId).delete();
    };
  }, [template, userId, venueId, venueSpecificData, worldId]);
};

export const useUpdateAuditoriumRecentSeatedUsers = (
  worldId: string,
  venueId: string | undefined,
  sectionId: string | undefined | null | false
) => {
  useUpdateRecentSeatedUsers(
    VenueTemplate.auditorium,
    worldId,
    venueId,
    useMemo(() => (sectionId ? { sectionId } : undefined), [sectionId])
  );
};

export const useUpdateTableRecentSeatedUsers = (
  template: TableSeatedUsersVenuesTemplates,
  worldId: string,
  venueId: string | undefined
) => {
  useUpdateRecentSeatedUsers(template, worldId, venueId, ALWAYS_EMPTY_OBJECT);
};
