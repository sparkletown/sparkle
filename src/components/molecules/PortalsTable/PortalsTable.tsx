import React from "react";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { AnyVenue, isVenueWithRooms } from "types/venues";

import { WithId } from "utils/id";

import { PortalStripForm } from "components/organisms/PortalStripForm";

import "./PortalsTable.scss";

export interface PortalsTableProps {
  space: WithId<AnyVenue>;
}

export const PortalsTable: React.FC<PortalsTableProps> = ({ space }) => {
  const isSupportingPortals = isVenueWithRooms(space);
  const portals = isSupportingPortals ? space?.rooms : ALWAYS_EMPTY_ARRAY;

  return (
    <div className="PortalsTable">
      {portals?.map((portal, index) => (
        <PortalStripForm
          key={index}
          portal={portal}
          index={index}
          spaceId={space?.id}
        />
      ))}
    </div>
  );
};
