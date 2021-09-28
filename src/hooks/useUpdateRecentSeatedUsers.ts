import { useEffect, useMemo } from "react";
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

const updateSeatedData = async <T extends VenueTemplate>(
  template: T,
  venueId: string | undefined,
  userId: string | undefined,
  venueSpecificData: RecentSeatedUserData<T>["venueSpecificData"] | FalseyValue
) => {
  if (!venueSpecificData || !venueId || !userId) return;
  console.log("updating");

  const withTimestamp: RecentSeatedUserTimestamp<T> = {
    template,
    venueId,
    venueSpecificData,
    lastSittingTimeMs: getCurrentTimeInMilliseconds(),
  };

  return firebase
    .firestore()
    .collection("venues")
    .doc(venueId)
    .collection("recentSeatedUsers")
    .doc(userId)
    .set(withTimestamp);
};

const useUpdateRecentSeatedUsers = <T extends VenueTemplate>(
  template: T,
  venueId: string | undefined,
  venueSpecificData: RecentSeatedUserData<T>["venueSpecificData"] | FalseyValue
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
  }, [template, userId, venueId, venueSpecificData]);
};

export const useUpdateAuditoriumRecentSeatedUsers = (
  venueId: string | undefined,
  sectionId: string | FalseyValue
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
