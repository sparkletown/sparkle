import React, { useMemo } from "react";
import { groupBy } from "lodash";

import { Room } from "types/rooms";
import { AnyVenue, isVenueWithRooms } from "types/venues";

import { WithId } from "utils/id";

import { useVenueEvents } from "hooks/events";

import { ButtonNG } from "components/atoms/ButtonNG/ButtonNG";
import { RoomCard } from "components/organisms/AdminVenueView/components/RoomCard/RoomCard";

import "./RunTabRooms.scss";

export interface RunTabRoomsProps {
  venue: WithId<AnyVenue>;
}

export const RunTabRooms: React.FC<RunTabRoomsProps> = ({ venue }) => {
  const venueWithRooms = isVenueWithRooms(venue);
  const rooms = venueWithRooms ? venue?.rooms ?? [] : [];

  const venueIds = useMemo(() => [venue.id], [venue.id]);
  const { events } = useVenueEvents({ venueIds: venueIds });
  // rooms have no id so events use room.title as their room property
  const groupedEvents = groupBy(events, "room");

  return (
    <div className="RunTabRooms__container">
      <div className="RunTabRooms__top RunTabRooms--spacing">
        <div className="RunTabRooms__counter">{rooms?.length ?? 0} Rooms</div>
        <div className="RunTabRooms__add">
          {venueWithRooms && (
            <ButtonNG
              isLink={true}
              linkTo={`/admin/venue/rooms/${venue.id}`}
              variant="primary"
            >
              Add a Room
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
            venueName={venue.name}
            room={room}
            events={groupedEvents[room.title]}
          />
        ))}
      </div>
    </div>
  );
};
