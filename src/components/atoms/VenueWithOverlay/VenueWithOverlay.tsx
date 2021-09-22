import { useCss } from "react-use";
import classNames from "classnames";

import { DEFAULT_VENUE_BANNER_COLOR } from "settings";

import { AnyVenue, EmbeddableVenue } from "types/venues";

import { WithId } from "utils/id";

import { useValidImage } from "hooks/useCheckImage";

import "./VenueWithOverlay.scss";

type VenueWithOverlayProps = {
  containerClassNames: string;
  venue: WithId<AnyVenue> | EmbeddableVenue;
  style?: React.CSSProperties;
};

export const VenueWithOverlay: React.FC<VenueWithOverlayProps> = ({
  children,
  containerClassNames,
  venue,
  style,
}) => {
  const [validBannerImageUrl] = useValidImage(
    venue?.config?.landingPageConfig?.coverImageUrl ||
      venue?.config?.landingPageConfig?.bannerImageUrl,
    DEFAULT_VENUE_BANNER_COLOR
  );

  const containerVars = useCss({
    background: `url("${validBannerImageUrl}")`,
  });

  const containerClasses = classNames(containerClassNames, containerVars);

  return (
    <div className={containerClasses} style={style}>
      <div className="VenueWithOverlay" />
      {children}
    </div>
  );
};
