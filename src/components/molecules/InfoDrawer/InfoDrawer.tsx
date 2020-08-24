import React, { useState } from "react";
import InformationLeftColumn from "components/organisms/InformationLeftColumn";
import InformationCard from "../InformationCard";
import { CampVenue } from "types/CampVenue";

interface PropsType {
  venue: CampVenue;
}

export const InfoDrawer: React.FunctionComponent<PropsType> = ({ venue }) => {
  const [isLeftColumnExpanded, setIsLeftColumnExpanded] = useState(false);

  return (
    <InformationLeftColumn
      venueLogoPath={venue?.host.icon ?? ""}
      isLeftColumnExpanded={isLeftColumnExpanded}
      setIsLeftColumnExpanded={setIsLeftColumnExpanded}
    >
      <InformationCard title="About the venue">
        <p className="title-sidebar">{venue.name}.</p>
        <p className="short-description-sidebar">
          {venue.config?.landingPageConfig.subtitle}
        </p>
        <p>{venue.config?.landingPageConfig.description}</p>
      </InformationCard>
    </InformationLeftColumn>
  );
};
