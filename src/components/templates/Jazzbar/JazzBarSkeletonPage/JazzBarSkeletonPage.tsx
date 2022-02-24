import React from "react";

import { DEFAULT_VENUE_LOGO, PORTAL_INFO_ICON_MAPPING } from "settings";

import { JazzbarVenue } from "types/venues";

import { WithId } from "utils/id";

import { InformationCard } from "components/molecules/InformationCard";
import { InformationLeftColumn } from "components/organisms/InformationLeftColumn";
import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import "./JazzBarSkeletonPage.scss";

interface PropsType {
  children: React.ReactNode;
  venue: WithId<JazzbarVenue>;
}

export const JazzBarSkeletonPage: React.FunctionComponent<PropsType> = ({
  children,
  venue,
}) => {
  const infoIcon =
    venue?.host?.icon ||
    (PORTAL_INFO_ICON_MAPPING[venue?.template ?? ""] ?? DEFAULT_VENUE_LOGO);

  return (
    <div className="jazz-bar-container">
      <InformationLeftColumn iconNameOrPath={infoIcon}>
        <InformationCard title="About the venue">
          <p>{venue?.name}</p>

          {venue?.config?.landingPageConfig?.subtitle && (
            <p>{venue?.config?.landingPageConfig?.subtitle}</p>
          )}
          {venue?.config?.landingPageConfig.description && (
            <RenderMarkdown
              text={venue.config?.landingPageConfig.description}
            />
          )}
        </InformationCard>
      </InformationLeftColumn>
      {children}
    </div>
  );
};
