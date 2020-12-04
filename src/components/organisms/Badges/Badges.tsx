import React, { useMemo } from "react";
import { User } from "@bugsnag/js";

import { Link } from "react-router-dom";
import { useFirestoreConnect } from "react-redux-firebase";

import { useConnectRelatedVenues } from "hooks/useConnectRelatedVenues";
import { useSelector } from "hooks/useSelector";

import { PLAYA_VENUE_NAME } from "settings";

import { CampRoomData } from "types/CampRoomData";
import { isCampVenue } from "types/CampVenue";
import { AnyVenue } from "types/Firestore";
import { Venue } from "types/Venue";

import { WithId } from "utils/id";
import { orderedVenuesSelector } from "utils/selectors";
import { venueInsideUrl, venuePreviewUrl } from "utils/url";

export const Badges: React.FC<{
  user: WithId<User>;
  currentVenue: WithId<Venue>;
}> = ({ user, currentVenue }) => {
  useFirestoreConnect([
    {
      collection: "users",
      doc: user.id,
      subcollections: [{ collection: "visits" }],
      storeAs: "userModalVisits",
    },
  ]);
  const visits = useSelector(
    (state) => state.firestore.ordered.userModalVisits
  );
  const venues = useSelector(orderedVenuesSelector);

  const { relatedVenues } = useConnectRelatedVenues({
    venueId: currentVenue.id,
    withEvents: false,
  });
  const relatedVenueIds = relatedVenues.map((venue) => venue.id);

  const visitHours = useMemo(() => {
    if (!visits) return 0;

    const visitSeconds = visits
      .filter((v) => v.id === currentVenue.id || relatedVenueIds.includes(v.id))
      .reduce((acc, v) => acc + v.timeSpent, 0);
    return Math.floor(visitSeconds / (60 * 60));
  }, [visits, currentVenue, relatedVenueIds]);

  // Only show visits to related venues
  const relevantVisits = visits?.filter(
    (visit) =>
      currentVenue.id === visit.id || relatedVenueIds.includes(visit.id)
  );

  const badges = useMemo(() => {
    if (!relevantVisits || !venues) return [];
    return relevantVisits
      .map((visit) => {
        const { venue, room } = findVenueAndRoomByName(visit.id, venues);
        if (
          !venue ||
          (currentVenue.id !== venue.id && !relatedVenueIds.includes(venue.id))
        )
          return undefined;

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
          image: venue.mapIconImageUrl,
          label: venue.name,
        };
      })
      .filter((b) => b !== undefined);
  }, [relevantVisits, venues, currentVenue, relatedVenueIds]);

  if (!relevantVisits) {
    return <>Visit venues to collect badges!</>;
  }

  return (
    <>
      <div className="visits">
        <div className="visit-item">
          <span className="visit-item__value">
            {visitHours > 1 ? `${visitHours}` : "< 1"} hrs
          </span>
          <span className="visit-item__label">Time spent in Sparkle</span>
        </div>
        <div className="separator" />
        <div className="visit-item">
          <span className="visit-item__value">
            {relevantVisits?.length ?? 0}
          </span>
          <span className="visit-item__label">Venues visited</span>
        </div>
      </div>
      <div className="badges-container">
        <div className="badges-title">{badges.length} Badges</div>
        <ul className="badge-list">
          {badges.map(
            (b) =>
              b && (
                <li className="badge-list-item" key={b.label}>
                  <Link to={getLocationLink(b.venue, b.room)}>
                    <img
                      className="badge-list-item-image"
                      src={b.image}
                      alt={`${b.label} badge`}
                    />
                  </Link>
                </li>
              )
            // label missing on hover - similar to playa
          )}
        </ul>
      </div>
    </>
  );
};

const findVenueAndRoomByName = (
  nameOrRoomTitle: string,
  venues: Array<WithId<AnyVenue>>
) => {
  const venue = venues.find(
    (v) =>
      v.name === nameOrRoomTitle ||
      (isCampVenue(v) && v.rooms.find((r) => r.title === nameOrRoomTitle))
  );

  if (!venue) return {};

  if (venue.name === nameOrRoomTitle) return { venue };

  return {
    venue,
    room:
      isCampVenue(venue) &&
      venue.rooms.find((r) => r.title === nameOrRoomTitle),
  };
};

const getLocationLink = (venue: WithId<AnyVenue>, room?: CampRoomData) => {
  if (venue.name === PLAYA_VENUE_NAME) {
    return venueInsideUrl(venue.id);
  }

  if (room) {
    return venuePreviewUrl(venue.id, room.title);
  }

  return venueInsideUrl(venue.id);
};
