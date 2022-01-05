import React from "react";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import EmergencyViewRoom from "./EmergencyViewRoom";

type EmergencyViewTabsProps = {
  descendantVenues: WithId<AnyVenue>[];
};

const EmergencyViewPageRooms: React.FC<EmergencyViewTabsProps> = ({
  descendantVenues,
}) => {
  const renderVenuesRooms = descendantVenues
    .map(
      (venue) =>
        !!venue?.rooms?.length && (
          <div key={venue.id}>
            <span className="EmergencyView__venue">{venue.name}</span>
            <div key={venue.id} className="EmergencyView__content">
              {venue?.rooms?.map((room) => {
                return (
                  <EmergencyViewRoom
                    key={room.title}
                    room={room}
                    isLive={false}
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
