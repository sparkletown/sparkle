import React from "react";

import { ROOM_TAXON } from "settings";

interface PortalIconProps {
  src: string;
}

export const PortalIcon: React.FC<PortalIconProps> = ({ src }) => (
  <div className="flex-shrink-0 h-10 w-10">
    <img
      className="max-h-10 max-w-10 rounded-md"
      src={src}
      alt={`${ROOM_TAXON.capital} icon`}
    />
  </div>
);
