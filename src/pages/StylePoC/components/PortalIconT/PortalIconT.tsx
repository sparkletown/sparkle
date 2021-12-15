import React from "react";

import { ROOM_TAXON } from "settings";

export interface PortalIconMProps {
  src: string;
}

export const PortalIconT: React.FC<PortalIconMProps> = ({ src }) => (
  <div className="PortalIconT flex items-center space-x-4">
    <div className="flex-shrink-0">
      <img
        className="h-8 w-8 rounded-full"
        src={src}
        alt={`${ROOM_TAXON.capital} icon`}
      />
    </div>
  </div>
);
