import React, { useCallback, useEffect, useMemo, useState } from "react";
import { chunk } from "lodash";
import { User } from "@bugsnag/js";

import { useFirestore } from "react-redux-firebase";

import { DEFAULT_AVATAR_IMAGE } from "settings";

import { isVenueWithRooms } from "types/CampVenue";
import { AnyVenue, UserVisit } from "types/Firestore";
import { Venue } from "types/Venue";

import { WithId } from "utils/id";
import { isTruthy, notEmpty } from "utils/types";

import { BadgeImage } from "./BadgeImage";

import "./Badges.scss";

export const Badges: React.FC<{
  user: WithId<User>;
  currentVenue: WithId<Venue>;
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
          ({ ...visitSnapshot.data(), id: visitSnapshot.id } as WithId<
            UserVisit
          >)
      ) ?? [];

    const venuesRequests = chunk(visits, 10).map((visitChunk) =>
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
        <li className="badge-list-item" key={badge.label}>
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
    <div className="badges-component">
      <div className="visits">
        <div className="visit-item">
          <span className="visit-item__value">
            {visitHours > 1 ? `${visitHours}` : "< 1"} hrs
          </span>
          <span className="visit-item__label">Time spent in Sparkle</span>
        </div>

        <div className="visit-separator" />

        <div className="visit-item">
          <span className="visit-item__value">
            {relevantVisits?.length ?? 0}
          </span>
          <span className="visit-item__label">Venues visited</span>
        </div>
      </div>

      <div className="badges-container">
        <div className="badges-title">{badges.length} Badges</div>
        <ul className="badge-list">{badgeList}</ul>
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
