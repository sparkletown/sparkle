import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { User } from "@bugsnag/js";

import { Link } from "react-router-dom";
import { useFirestore } from "react-redux-firebase";

import { PLAYA_VENUE_NAME } from "settings";

import { CampRoomData } from "types/CampRoomData";
import { isVenueWithRooms } from "types/CampVenue";
import { AnyVenue, UserVisit } from "types/Firestore";
import { Venue } from "types/Venue";

import { WithId } from "utils/id";
import { venueInsideUrl, venuePreviewUrl } from "utils/url";
import { notEmpty } from "utils/types";

import {BadgeImage} from './BadgeImage'

export const Badges: React.FC<{
  user: WithId<User>;
  currentVenue: WithId<Venue>;
}> = ({ user, currentVenue }) => {
  const [visits, setVisits] = useState<WithId<UserVisit>[]>([]);
  const [venues, setVenues] = useState<WithId<AnyVenue>[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const badgeImgRefs: RefObject<HTMLImageElement[]> = useRef([]);

  const firestore = useFirestore();

  const fetchAllVenues = useCallback(async () => {
    const venuesSnapshot = await firestore.collection("venues").get();

    const userSnapshot = await firestore.collection("users").doc(user.id).get();
    const visitsSnapshot = await userSnapshot.ref.collection("visits").get();

    const venues =
      venuesSnapshot.docs.map(
        (venueSnapshot) =>
          ({ ...venueSnapshot.data(), id: venueSnapshot.id } as WithId<
            AnyVenue
          >)
      ) ?? [];
    const visits =
      visitsSnapshot.docs.map(
        (visitSnapshot) =>
          ({ ...visitSnapshot.data(), id: visitSnapshot.id } as WithId<
            UserVisit
          >)
      ) ?? [];

    setVenues(venues);
    setVisits(visits);
    setLoading(false)
  }, [firestore, user.id]);

  useEffect(() => {
    setLoading(true)
    fetchAllVenues();
  }, [fetchAllVenues]);

  const venueNames = useMemo(() => venues.map((venue) => venue.name), [venues])

  const visitHours = useMemo(() => {
    if (!visits) return 0;

    const visitSeconds = visits
      .filter((v) => v.id === currentVenue.id || venueNames.includes(v.id))
      .reduce((acc, v) => acc + v.timeSpent, 0);
    return Math.floor(visitSeconds / (60 * 60));
  }, [visits, currentVenue, venueNames]);

  // Only show visits to related venues
  const relevantVisits = visits?.filter(
    (visit) => currentVenue.name === visit.id || venueNames.includes(visit.id)
  );

  const badges = useMemo(() => {
    if (!relevantVisits || !venues) return [];
    return relevantVisits
      .map((visit) => {
        const { venue, room } = findVenueAndRoomByName(visit.id, venues);
        if (
          !venue ||
          (currentVenue.id !== venue.id && !venueNames.includes(venue.id))
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
          image: venue?.host?.icon,
          label: venue.name,
        };
      })
      .filter((b) => b !== undefined);
  }, [relevantVisits, venues, currentVenue, venueNames]);

  const badgeList = useMemo(
    () =>
      badges.filter(notEmpty).map((b, index) => (
        <li className="badge-list-item" key={b.label}>
          <Link to={getLocationLink(b.venue, b.room)}>
            <BadgeImage badgeImgRefs={badgeImgRefs} image={b.image} label={b.label} index={index} />
          </Link>
        </li>
      )),
    [badges, badgeImgRefs]
  );

  if (loading) {
    return <div className="visits">Loading...</div>
  }

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
        <ul className="badge-list">{badgeList}</ul>
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

const getLocationLink = (venue: WithId<AnyVenue>, room?: CampRoomData) => {
  if (venue.name === PLAYA_VENUE_NAME) {
    return venueInsideUrl(venue.id);
  }

  if (room) {
    return venuePreviewUrl(venue.id, room.title);
  }

  return venueInsideUrl(venue.id);
};
