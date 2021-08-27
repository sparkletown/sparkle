import React, { useEffect, useMemo, useState } from "react";
import { useFirebase } from "react-redux-firebase";

import { Room } from "types/rooms";
import { AnimateMapVenue, AnyVenue } from "types/venues";

import { isEventLive } from "utils/event";
import { WithId } from "utils/id";
import { WithVenue } from "utils/venue";

import { useWorldUsers } from "hooks/users";
import { useUser } from "hooks/useUser";

import { useVenueEvents } from "../../../../hooks/events";
import { useRecentLocationsUsers } from "../hooks/useRecentLocationsUsers";
import { UseRelatedPartymapRoomsData } from "../hooks/useRelatedPartymapRooms";

import { CloudDataProvider } from "./DataProvider/CloudDataProvider";

export interface CloudDataProviderWrapperProps {
  venue: WithId<AnimateMapVenue>;
  newDataProviderCreate: (dataProvider: CloudDataProvider) => void;
  relatedRooms: UseRelatedPartymapRoomsData;
}

export type RoomWithFullData<T> = T & {
  id: number;
  isLive?: boolean;
  countUsers?: number;
};

const emptyRelatedVenues: WithId<AnyVenue>[] = [];

export const CloudDataProviderWrapper: React.FC<CloudDataProviderWrapperProps> = ({
  venue,
  newDataProviderCreate,
  relatedRooms,
}) => {
  const [dataProvider, setDataProvider] = useState<CloudDataProvider | null>(
    null
  );
  const firebase = useFirebase();
  const user = useUser();
  const worldUsers = useWorldUsers();

  const venues: WithId<AnyVenue>[] = useMemo(
    () =>
      relatedRooms
        ? relatedRooms
            .filter((room) => "venue" in room && "id" in venue)
            .map((room) => (room as WithVenue<Room>)?.venue as WithId<AnyVenue>)
        : emptyRelatedVenues,
    [relatedRooms, venue]
  );

  const venueIds = useMemo(() => venues.map((venue) => venue.id), [venues]);

  const { events, isEventsLoading } = useVenueEvents({ venueIds });

  const locationUsers = useRecentLocationsUsers(venues);

  const liveEvents = useMemo(
    () =>
      events
        .filter((event) => isEventLive(event))
        .map((event) => {
          return {
            venueId: event.venueId,
            name: event.name,
          };
        }),
    [events]
  );

  const roomsWithFullData:
    | RoomWithFullData<WithVenue<Room> | Room>[]
    | undefined = relatedRooms?.map((room, index) => {
    if ("venue" in room) {
      const roomWithVenue = room as WithVenue<Room>;
      const venue = roomWithVenue.venue as WithId<AnyVenue>;
      const location = locationUsers.find(
        (location) => location.id === venue.id
      );

      if (location) {
        return {
          ...roomWithVenue,
          id: index,
          countUsers: location ? location.users.length : 0,
          isLive: !!liveEvents.find((event) => event.venueId === location?.id),
        };
      }
    }

    return {
      ...room,
      ...{ id: index, isLive: !!(room.title.length % 2), countUsers: 0 },
    };
  });

  useEffect(() => {
    console.log("locationsData", {
      relatedRooms,
      isEventsLoading,
      events,
      locationUsers,
      liveEvents,
      roomsWithFullData,
    });
  }, [
    relatedRooms,
    events,
    isEventsLoading,
    liveEvents,
    locationUsers,
    roomsWithFullData,
  ]);

  useEffect(() => {
    if (dataProvider) dataProvider.updateRooms(roomsWithFullData);
  }, [roomsWithFullData, dataProvider]);

  useEffect(() => {
    if (dataProvider) dataProvider.updateUsersAsync(worldUsers);
  }, [worldUsers, dataProvider]);

  useEffect(
    () => {
      if (typeof user.userId === "string" && !dataProvider && firebase) {
        const dataProvider = new CloudDataProvider(
          user.userId,
          user.profile?.pictureUrl,
          firebase,
          venue.playerioGameId ?? "sparkleburn-k1eqbxs6vusie0yujooma"
        );
        dataProvider.updateRooms(roomsWithFullData);
        dataProvider.updateUsers(worldUsers);
        setDataProvider(dataProvider);
        newDataProviderCreate(dataProvider);
      }
    },
    // note: we really doesn't need rerender this for others dependencies
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [user, dataProvider, firebase]
  );

  return null;
};
