import React from "react";

import { CampVenue } from "types/CampVenue";

import InformationLeftColumn from "components/organisms/InformationLeftColumn";
import InformationCard from "components/molecules/InformationCard";

interface InfoDrawerProps {
  venue: CampVenue;
}

export const InfoDrawer: React.FC<InfoDrawerProps> = ({ venue }) => {
  return (
    <InformationLeftColumn venueLogoPath={venue?.host.icon ?? ""}>
      <InformationCard title="About the venue">
        <p
          className="title-sidebar"
          style={{ fontSize: 21, fontWeight: "bold" }}
        >
          {venue.name}
        </p>
        <p className="short-description-sidebar" style={{ fontSize: 18 }}>
          {venue.config?.landingPageConfig.subtitle}
        </p>
        <p style={{ fontSize: 13 }}>
          {venue.config?.landingPageConfig.description}
        </p>
      </InformationCard>
    </InformationLeftColumn>
  );
};
