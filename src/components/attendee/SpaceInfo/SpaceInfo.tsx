import { Link } from "react-router-dom";
import { useCss } from "react-use";

import { ATTENDEE_INSIDE_URL, DEFAULT_MAP_BACKGROUND } from "settings";

import { generateUrl } from "utils/url";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useValidImage } from "hooks/useCheckImage";

import CN from "./SpaceInfo.module.scss";

export const SpaceInfo: React.FC = () => {
  const { world, space } = useWorldAndSpaceByParams();
  const [mapBackground] = useValidImage(
    space?.host?.icon,
    DEFAULT_MAP_BACKGROUND
  );

  const visitSpaceUrl = generateUrl({
    route: ATTENDEE_INSIDE_URL,
    required: ["worldSlug", "spaceSlug"],
    params: { worldSlug: world?.slug, spaceSlug: space?.slug },
  });

  const mapStyles = useCss({
    backgroundImage: `url(${mapBackground})`,
  });

  return (
    <div className={CN.spaceWrapper}>
      <div className={`${CN.spaceImage} ${mapStyles}`}></div>
      <div>About {space?.name || "Space"}</div>
      <div className={CN.spaceDescription}>
        {space?.config?.landingPageConfig?.description ?? ""}
      </div>
      <Link to={visitSpaceUrl} className={CN.spaceLink}>
        Go to homepage
      </Link>
    </div>
  );
};
