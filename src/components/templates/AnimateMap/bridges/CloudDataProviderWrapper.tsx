import React, { useEffect, useMemo } from "react";
import { useAsync } from "react-use";

import { Room } from "types/rooms";
import { AnimateMapVenue, AnyVenue, VenueEvent } from "types/venues";

import { WithId, WithVenueId } from "utils/id";
import { WithVenue } from "utils/venue";

import { useVenueEvents } from "hooks/events";

import {
  useRelatedPartymapRooms,
  UseRelatedPartymapRoomsData,
} from "../hooks/useRelatedPartymapRooms";

import { CloudDataProvider } from "./DataProvider/CloudDataProvider";

export interface CloudDataProviderWrapperProps {
  venue: WithId<AnimateMapVenue>;
  relatedRooms: UseRelatedPartymapRoomsData;
  newDataProviderCreate: (dataProvider: CloudDataProvider) => void;
}

const emptyRelatedVenues: WithId<AnyVenue>[] = [];

export const CloudDataProviderWrapper: React.FC<CloudDataProviderWrapperProps> = ({
  venue,
  relatedRooms,
}) => {
  const venues: Array<AnyVenue> = useMemo(
    () =>
      relatedRooms
        ? relatedRooms
            .filter((room) => "venue" in room && "id" in venue)
            .map((room) => (room as WithVenue<Room>)?.venue)
        : emptyRelatedVenues,
    [relatedRooms, venue]
  );

  const venueIds = useMemo(
    () => venues.map((venue) => (venue as WithId<AnyVenue>).id),
    [venues]
  );

  const { events, isEventsLoading } = useVenueEvents({
    venueIds,
  });

  console.log({ events, isEventsLoading });

  return null;
};
