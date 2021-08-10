import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFirestore } from "react-redux-firebase";
import { User } from "@bugsnag/js";
import { chunk } from "lodash";

import {
  DEFAULT_AVATAR_IMAGE,
  FIRESTORE_QUERY_IN_ARRAY_MAX_ITEMS,
} from "settings";

import { UserVisit } from "types/Firestore";
import { AnyVenue, isVenueWithRooms } from "types/venues";

import { WithId } from "utils/id";
import { isTruthy, notEmpty } from "utils/types";

import { BadgeImage } from "./BadgeImage";

import "./Badges.scss";

export const Badges: React.FC<{
  user: WithId<User>;
  currentVenue: WithId<AnyVenue>;
}> = ({ user, currentVenue }) => {
  const [visits, setVisits] = useState<WithId<UserVisit>[]>([]);
  const [venues, setVenues] = useState<WithId<AnyVenue>[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const firestore = useFirestore();

  const fetchAllVenues = useCallback(async () => {
    const userSnapshot = await firestore.collection("users").doc(user.id).get();
    const visitsSnapshot = await userSnapshot.ref.collection("visits").get();

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
      firestore
        .collection("venues")
        .where(
          "name",
          "in",
          visitChunk.map((visit) => visit.id)
        )
        .get()
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
    setIsLoading(false);
  }, [firestore, user.id]);

  useEffect(() => {
    setIsLoading(true);
    fetchAllVenues();
  }, [fetchAllVenues]);

  const venueNames = useMemo(() => venues.map((venue) => venue.name), [venues]);

  const visitHours = useMemo(() => {
    if (!visits) return 0;

    const visitSeconds = visits
      .filter((v) => v.id === currentVenue.id || venueNames.includes(v.id))
      .reduce((acc, v) => acc + v.timeSpent, 0);
    return Math.floor(visitSeconds / (60 * 60));
  }, [visits, currentVenue, venueNames]);

  // Only show visits for existing venues
  const relevantVisits = visits?.filter(
    (visit) => currentVenue.name === visit.id || venueNames.includes(visit.id)
  );

  const badges = useMemo(() => {
    if (!relevantVisits || !venues) return [];
    return relevantVisits
      .map((visit) => {
        const { venue, room } = findVenueAndRoomByName(visit.id, venues);
        if (!venue) return undefined;

        if (room) {
          return {
            venue,
            room,
            image: room.image_url,
            label: room.title,
          };
        }

        return {
          venue,
          image: venue?.host?.icon ?? DEFAULT_AVATAR_IMAGE,
          label: venue.name,
        };
      })
      .filter((b) => b !== undefined);
  }, [relevantVisits, venues]);

  const badgeList = useMemo(
    () =>
      badges.filter(notEmpty).map((badge) => (
        <li className="Badges__list-item" key={badge.label}>
          <BadgeImage image={badge.image} name={badge.venue.name} />
        </li>
      )),
    [badges]
  );

  if (isLoading) {
    return <div className="visits">Loading...</div>;
  }

  if (!relevantVisits) {
    return <>Visit venues to collect badges!</>;
  }

  return (
    <div className="Badges">
      <div className="Badges__visits">
        <div className="Badges__visit">
          <span className="Badges__visit-value">
            {visitHours > 1 ? visitHours : "< 1"} hrs
          </span>
          <span className="Badges__visit-label">Time spent in Sparkle</span>
        </div>

        <div className="Badges__visit">
          <span className="Badges__visit-value">
            {relevantVisits?.length ?? 0}
          </span>
          <span className="Badges__visit-label">Venues visited</span>
        </div>
      </div>

      <div className="Badges__container">
        <div className="Badges__title">{badges.length} Badges</div>
        <ul className="Badges__list">{badgeList}</ul>
      </div>
    </div>
  );
};

const findVenueAndRoomByName = (
  nameOrRoomTitle: string,
  venues: Array<WithId<AnyVenue>>
) => {
  const venue = venues.find(
    (v) =>
      v.name === nameOrRoomTitle ||
      (isVenueWithRooms(v) && v.rooms?.find((r) => r.title === nameOrRoomTitle))
  );

  if (!venue) return {};

  if (venue.name === nameOrRoomTitle) return { venue };

  return {
    venue,
    room:
      isVenueWithRooms(venue) &&
      venue.rooms?.find((r) => r.title === nameOrRoomTitle),
  };
};
