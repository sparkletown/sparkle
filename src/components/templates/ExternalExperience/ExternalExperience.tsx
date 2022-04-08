import React, { useEffect } from "react";
import { useCss } from "react-use";
import cn from "classnames";

import { STRING_SPACE } from "settings";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { externalUrlAdditionalProps, openUrl } from "utils/url";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import CN from "./ExternalExperience.module.scss";

const componentRules = {
  p: "span",
};

interface ExternalExperienceProps {
  space: WithId<AnyVenue>;
}

export const ExternalExperience: React.FC<ExternalExperienceProps> = ({
  space,
}) => {
  const redirectUrl = space.zoomUrl;

  useEffect(() => {
    if (!redirectUrl) return;

    openUrl(redirectUrl);
  }, [redirectUrl]);

  const styles = useCss({
    background: `url(${space.config?.landingPageConfig.coverImageUrl}) center center`,
  });

  return (
    <div className={cn(CN.general, styles)}>
      <img src={space.host?.icon} alt="space icon" className={CN.venueIcon} />

      <div className={CN.infoContainer}>
        <div className={CN.mainInfo}>
          <h1 className={CN.venueName}>{space.name}</h1>

          <p className={CN.venueDescription}>
            <RenderMarkdown
              text={space.config?.landingPageConfig.description}
              components={componentRules}
            />
          </p>
        </div>

        <div className={CN.secondaryInfo}>
          {redirectUrl && (
            <p className={CN.redirectText}>
              Opened {space.name} in a new tab <br />
              <a href={redirectUrl} {...externalUrlAdditionalProps}>
                {redirectUrl}
              </a>
              <br />
              <br />
              Doesn&apos;t work? Try enabling pop ups on your browser <br />
              and click{STRING_SPACE}
              <a href={redirectUrl} {...externalUrlAdditionalProps}>
                here
              </a>
              {STRING_SPACE}
              to try again.
            </p>
          )}

          {!redirectUrl && (
            <p>
              No URL was provided for {space.name}.<br />
              Please contact your event organiser.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
