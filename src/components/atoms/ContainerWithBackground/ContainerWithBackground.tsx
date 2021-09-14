import { useCss } from "react-use";
import classNames from "classnames";

import { DEFAULT_VENUE_BANNER } from "settings";

import { AnyVenue, EmbeddableVenue } from "types/venues";

import { WithId } from "utils/id";

import { useValidImage } from "hooks/useCheckImage";

type ContainerWithBackgroundProps = {
  containerName: string;
  className?: string;
  venue: WithId<AnyVenue> | EmbeddableVenue;
  style?: React.CSSProperties;
};

export const ContainerWithBackground: React.FC<ContainerWithBackgroundProps> = ({
  children,
  containerName,
  venue,
  className = "",
  style,
}) => {
  const [validBannerImageUrl] = useValidImage(
    venue?.config?.landingPageConfig?.coverImageUrl ||
      venue?.config?.landingPageConfig?.bannerImageUrl,
    DEFAULT_VENUE_BANNER
  );

  const containerVars = useCss({
    background: `url("${validBannerImageUrl}")`,
  });

  const containerClasses = classNames(containerName, className, containerVars);

  const overlayVars = useCss({
    position: "fixed",
    height: "100%",
    width: "100%",
    background: "rgba(0,0,0, 0.8)",
  });

  const overlayClasses = classNames(`${containerName}__overlay`, overlayVars);

  return (
    <div className={containerClasses} style={style}>
      <div className={overlayClasses} />
      {children}
    </div>
  );
};
