import React from "react";

import { AnyVenue, ScheduledVenueEvent } from "types/venues";

import { isEventLive } from "utils/event";
import { WithId } from "utils/id";

import EmergencyViewRoom from "./EmergencyViewRoom";

type EmergencyViewTabsProps = {
  descendantVenues: WithId<AnyVenue>[];
  liveAndFutureEvents: ScheduledVenueEvent[];
};

const EmergencyViewPageRooms: React.FC<EmergencyViewTabsProps> = ({
  descendantVenues,
  liveAndFutureEvents,
}) => {
  const liveEvents = liveAndFutureEvents.filter(isEventLive);

  const isRoomHasLiveEvent = (room: string) =>
    liveEvents.map((event) => event.room).includes(room);

  const renderVenuesRooms = descendantVenues
    .map(
      (venue) =>
        !!venue?.rooms?.length && (
          <div key={venue.id}>
            <span className="EmergencyView__venue">{venue.name}</span>
            <div key={venue.id} className="EmergencyView__content">
              {venue?.rooms?.map((room) => {
                const isRoomLive = isRoomHasLiveEvent(room.title);

                return (
                  <EmergencyViewRoom
                    key={room.title}
                    room={room}
                    isLive={isRoomLive}
                  />
                );
              })}
            </div>
          </div>
        )
    )
    .filter((venue) => !!venue);

  return <>{renderVenuesRooms}</>;
};

export default EmergencyViewPageRooms;
