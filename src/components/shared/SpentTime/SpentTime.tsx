import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { chunk } from "lodash";

import {
  COLLECTION_SPACES,
  FIRESTORE_QUERY_IN_ARRAY_MAX_ITEMS,
} from "settings";

import { getUserRef } from "api/profile";

import { UserVisit } from "types/Firestore";
import { UserId } from "types/id";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { isTruthy } from "utils/types";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import CN from "./SpentTime.module.scss";

interface SpentTimeProps {
  userId: UserId;
}

export const SpentTime: React.FC<SpentTimeProps> = ({ userId }) => {
  const { isLoaded: isWorldLoaded, spaceId } = useWorldAndSpaceByParams();
  const [visits, setVisits] = useState<WithId<UserVisit>[]>([]);
  const [venues, setVenues] = useState<WithId<AnyVenue>[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // @debt move firestore code from the component + check the logic if it can be updated
  const fetchAllVenues = useCallback(async () => {
    const visitsSnapshot = await getUserRef(userId).collection("visits").get();

    const visits: WithId<UserVisit>[] =
      visitsSnapshot.docs.map(
        (visitSnapshot) =>
          ({
            ...visitSnapshot.data(),
            id: visitSnapshot.id,
          } as WithId<UserVisit>)
      ) ?? [];

    const venuesRequests = chunk(
      visits,
      FIRESTORE_QUERY_IN_ARRAY_MAX_ITEMS
    ).map((visitChunk) =>
      getDocs(
        query(
          collection(getFirestore(), COLLECTION_SPACES),
          where(
            "name",
            "in",
            visitChunk.map((visit) => visit.id)
          )
        )
      )
    );

    let venues: WithId<AnyVenue>[] = [];
    const hasVenuesRequests = isTruthy(venuesRequests);

    // If there are no venues visited avoid sending the request.
    if (hasVenuesRequests) {
      const requestSnapshots = await Promise.all(venuesRequests);

      // Promise all returns arrays as response. That's why there is so much depth.
      // TODO: Same logic can be used for the private chats as well.
      venues = requestSnapshots.flatMap((venuesSnapshot) =>
        venuesSnapshot.docs.map(
          (venueSnapshot) =>
            ({
              ...venueSnapshot.data(),
              id: venueSnapshot.id,
            } as WithId<AnyVenue>)
        )
      );
    }

    setVenues(venues);
    setVisits(visits);
  }, [userId, setVenues, setVisits]);

  useEffect(() => {
    setIsLoading(true);
    const stop = () => setIsLoading(false);

    fetchAllVenues()
      .catch((e) => console.error(SpentTime.name, e))
      .finally(stop);

    return stop;
  }, [setIsLoading, fetchAllVenues]);

  const venueNames = useMemo(() => venues.map((venue) => venue.name), [venues]);

  const visitHours = useMemo(() => {
    if (!visits) return 0;

    const visitSeconds = visits
      .filter((v) => v.id === spaceId || venueNames.includes(v.id))
      .reduce((acc, v) => acc + v.timeSpent, 0);
    return Math.floor(visitSeconds / (60 * 60));
  }, [visits, spaceId, venueNames]);

  if (isLoading) {
    return (
      <div data-bem="SpentTime--loading" className={CN.general}>
        Loading...
      </div>
    );
  }

  if (!isWorldLoaded) {
    return null;
  }

  return (
    <div data-bem="SpentTime" className={CN.general}>
      {visitHours > 1 ? visitHours : "< 1"} hours spent here
    </div>
  );
};
