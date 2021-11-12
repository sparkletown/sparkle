import React, { useMemo } from "react";
import { groupBy } from "lodash";

import { ADMIN_V1_ROOMS_BASE_URL, ROOM_TAXON, ROOMS_TAXON } from "settings";

import { Room } from "types/rooms";
import { AnyVenue, isVenueWithRooms } from "types/venues";

import { WithId } from "utils/id";

import { useVenueEvents } from "hooks/events";

import { RoomCard } from "pages/AdminVenueView/components/RoomCard/RoomCard";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./RunTabRooms.scss";

export interface RunTabRoomsProps {
  venue: WithId<AnyVenue>;
}

const emptyVenueRooms: Room[] = [];

export const RunTabRooms: React.FC<RunTabRoomsProps> = ({ venue }) => {
  const venueWithRooms = isVenueWithRooms(venue);
  const rooms = venueWithRooms
    ? venue?.rooms ?? emptyVenueRooms
    : emptyVenueRooms;

  const venueIds = useMemo(() => [venue.id], [venue.id]);
  const { events } = useVenueEvents({ venueIds: venueIds });
  // rooms have no id so events use room.title as their room property
  const groupedEvents = groupBy(events, "room");

  return (
    <div className="RunTabRooms__container">
      <div className="RunTabRooms__top RunTabRooms--spacing">
        <div className="RunTabRooms__counter">
          {rooms?.length ?? 0} {ROOMS_TAXON.capital}
        </div>
        <div className="RunTabRooms__add">
          {venueWithRooms && (
            <ButtonNG
              isLink={true}
              linkTo={`${ADMIN_V1_ROOMS_BASE_URL}/${venue.id}`}
              variant="primary"
            >
              Add a {ROOM_TAXON.capital}
            </ButtonNG>
          )}
        </div>
      </div>
      <div className="RunTabRooms__grid RunTabRooms--spacing">
        {rooms.map((room: Room, index) => (
          <RoomCard
            key={index}
            index={index}
            venueId={venue.id}
            room={room}
            events={groupedEvents[room.title]}
          />
        ))}
      </div>
    </div>
  );
};
