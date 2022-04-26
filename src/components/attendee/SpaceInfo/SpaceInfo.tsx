import React from "react";
import { Link } from "react-router-dom";
import { useCss } from "react-use";

import { DEFAULT_MAP_BACKGROUND } from "settings";

import { SpaceWithId } from "types/id";

import { useValidImage } from "hooks/image/useValidImage";

import CN from "./SpaceInfo.module.scss";

type SpaceInfoProps = {
  space?: SpaceWithId;
};

export const SpaceInfo: React.FC<SpaceInfoProps> = ({ space }) => {
  const { src: mapBackground } = useValidImage(
    space?.host?.icon,
    DEFAULT_MAP_BACKGROUND
  );

  // @debt: To be replaced with proper redirect mechanism
  const visitSpaceUrl = () => alert("NOT YET IMPLEMENTED");

  const mapStyles = useCss({
    backgroundImage: `url(${mapBackground})`,
  });

  if (!space) {
    return <div>Loading...</div>;
  }

  return (
    <div className={CN.spaceWrapper}>
      <div className={`${CN.spaceImage} ${mapStyles}`}></div>
      <div className={CN.headerTitle}>About {space?.name || "Space"}</div>
      <div className={CN.spaceDescription}>
        {space?.config?.landingPageConfig?.description ?? ""}
      </div>
      <Link to="#" onClick={visitSpaceUrl} className={CN.spaceLink}>
        Go to homepage
      </Link>
    </div>
  );
};
