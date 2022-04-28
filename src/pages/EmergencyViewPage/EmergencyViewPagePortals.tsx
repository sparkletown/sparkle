import React from "react";

import { SpaceWithId } from "types/id";

import { EmergencyViewPortal } from "./EmergencyViewPortal";

type EmergencyViewTabsProps = {
  worldSpaces: SpaceWithId[];
};

export const EmergencyViewPagePortals: React.FC<EmergencyViewTabsProps> = ({
  worldSpaces,
}) => {
  const renderPortals = worldSpaces
    .map(
      (space) =>
        !!space?.rooms?.length && (
          <div key={space.id}>
            <span className="EmergencyView__venue">{space.name}</span>
            <div key={space.id} className="EmergencyView__content">
              {space?.rooms?.map((portal) => (
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
    .filter((space) => !!space);

  return <>{renderPortals}</>;
};
