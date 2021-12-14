import React from "react";

import { ROOM_TAXON } from "settings";

import { generateClassNameGetter } from "pages/StylePoC/util";

import CN from "./PortalIconM.module.scss";

const cn = generateClassNameGetter(CN);

export interface PortalIconMProps {
  src: string;
}

export const PortalIconM: React.FC<PortalIconMProps> = ({ src }) => (
  <div className={cn("PortalIconM")}>
    <img
      className={cn("PortalIconM__image")}
      src={src}
      alt={`${ROOM_TAXON.capital} icon`}
    />
  </div>
);
