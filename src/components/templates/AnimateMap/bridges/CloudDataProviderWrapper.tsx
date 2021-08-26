import React, { useEffect, useMemo } from "react";

import { Room } from "types/rooms";
import { AnimateMapVenue, AnyVenue, VenueEvent } from "types/venues";

import { WithId, WithVenueId } from "utils/id";
import { WithVenue } from "utils/venue";

import { useVenueEvents } from "hooks/events";

import { useRelatedPartymapRooms } from "../hooks/useRelatedPartymapRooms";

import { CloudDataProvider } from "./DataProvider/CloudDataProvider";

export interface CloudDataProviderWrapperProps {
  venue: WithId<AnimateMapVenue>;
  newDataProviderCreate: (dataProvider: CloudDataProvider) => void;
}

const emptyRelatedVenues: WithId<AnyVenue>[] = [];
const emptyRelatedEvents: WithVenueId<VenueEvent>[] = [];

export const CloudDataProviderWrapper: React.FC<CloudDataProviderWrapperProps> = ({
  venue,
}) => {
  const relatedRooms = useRelatedPartymapRooms({ venue });
  const rooms = useMemo(() => relatedRooms, [relatedRooms]);

  const venues: Array<AnyVenue> = useMemo(
    () =>
      rooms
        ? rooms
            .filter((room) => "venue" in room && "id" in venue)
            .map((room) => (room as WithVenue<Room>)?.venue)
        : emptyRelatedVenues,
    [rooms]
  );

  const venueIds = useMemo(
    () => venues.map((venue) => (venue as WithId<AnyVenue>).id),
    [venues]
  );

  console.log(emptyRelatedEvents);

  // Если раскоментировать вот это, то компонент начинает циклично ререндерится и вызывать хуки, пока прилл не повиснет
  const { isEventsLoading, events = emptyRelatedEvents } = useVenueEvents({
    venueIds: venueIds,
  });

  console.log("venue", venue);
  console.log("events", isEventsLoading, events);

  useEffect(() => {
    console.log("change venue", venue);
  }, [venue]);

  useEffect(() => {
    console.log("change rooms", rooms);
  }, [rooms]);

  useEffect(() => {
    console.log("change venues", venues);
  }, [venues]);

  useEffect(() => {
    console.log("change venueIds", venueIds);
  }, [venueIds]);

  return null;
};
