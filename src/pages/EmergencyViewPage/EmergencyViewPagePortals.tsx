import React from "react";

import { SpaceWithId } from "types/id";

import { EmergencyViewPortal } from "./EmergencyViewPortal";

type EmergencyViewTabsProps = {
  descendantVenues: SpaceWithId[];
};

export const EmergencyViewPagePortals: React.FC<EmergencyViewTabsProps> = ({
  descendantVenues,
}) => {
  const renderVenuesPortals = descendantVenues
    .map(
      (venue) =>
        !!venue?.rooms?.length && (
          <div key={venue.id}>
            <span className="EmergencyView__venue">{venue.name}</span>
            <div key={venue.id} className="EmergencyView__content">
              {venue?.rooms?.map((portal) => (
                <EmergencyViewPortal
                  key={portal.title}
                  portal={portal}
                  isLive={false}
                />
              ))}
            </div>
          </div>
        )
    )
    .filter((venue) => !!venue);

  return <>{renderVenuesPortals}</>;
};
