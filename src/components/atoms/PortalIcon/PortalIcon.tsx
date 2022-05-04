import React from "react";
import classNames from "classnames";

import { ROOM_TAXON } from "settings";

import { isDefaultPortalIcon } from "utils/image";

interface PortalIconProps {
  src: string;
}

export const PortalIcon: React.FC<PortalIconProps> = ({ src }) => {
  const portalIconClasses = classNames("max-h-10 max-w-10 rounded-md", {
    "bg-gray-800": isDefaultPortalIcon(src),
  });

  return (
    <div className="flex-shrink-0 h-10 w-10">
      <img
        className={portalIconClasses}
        src={src}
        alt={`${ROOM_TAXON.capital} icon`}
      />
    </div>
  );
};
