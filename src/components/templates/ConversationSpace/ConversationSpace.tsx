import React, { useEffect, useState } from "react";

import {
  ALWAYS_EMPTY_ARRAY,
  DEFAULT_VENUE_LOGO,
  PORTAL_INFO_ICON_MAPPING,
} from "settings";

import { GenericVenue, VenueTemplate } from "types/venues";

import { WithId } from "utils/id";

import { useAnalytics } from "hooks/useAnalytics";
import { useExperiences } from "hooks/useExperiences";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useShowHide } from "hooks/useShowHide";
import { useUpdateTableRecentSeatedUsers } from "hooks/useUpdateRecentSeatedUsers";

import { InformationLeftColumn } from "components/organisms/InformationLeftColumn";
import { RenderMarkdown } from "components/organisms/RenderMarkdown";
import { Room } from "components/organisms/Room";

import InformationCard from "components/molecules/InformationCard";
import TableComponent from "components/molecules/TableComponent";
import { TableHeader } from "components/molecules/TableHeader";
import { TablesControlBar } from "components/molecules/TablesControlBar";
import { TablesUserList } from "components/molecules/TablesUserList";
import { UserList } from "components/molecules/UserList";

import { BackButton } from "components/atoms/BackButton";
import { VenueWithOverlay } from "components/atoms/VenueWithOverlay/VenueWithOverlay";

import { TABLES } from "./constants";

import "./ConversationSpace.scss";

export interface ConversationSpaceProps {
  venue: WithId<GenericVenue>;
}

export const ConversationSpace: React.FC<ConversationSpaceProps> = ({
  venue,
}) => {
  const analytics = useAnalytics({ venue });

  const { parentVenue, parentVenueId } = useRelatedVenues({
    currentVenueId: venue?.id,
  });

  const {
    isShown: showOnlyAvailableTables,
    toggle: toggleTablesVisibility,
  } = useShowHide();

  const [seatedAtTable, setSeatedAtTable] = useState<string>();

  useUpdateTableRecentSeatedUsers(
    VenueTemplate.conversationspace,
    seatedAtTable && venue?.id
  );

  useEffect(() => {
    if (seatedAtTable) analytics.trackSelectTableEvent();
  }, [analytics, seatedAtTable]);

  useExperiences(venue?.name);

  const tables = venue?.config?.tables ?? TABLES;

  const infoIcon =
    venue?.host?.icon ||
    (PORTAL_INFO_ICON_MAPPING[venue.template] ?? DEFAULT_VENUE_LOGO);

  return (
    <>
      <InformationLeftColumn iconNameOrPath={infoIcon}>
        <InformationCard title="About the venue">
          <p className="title-sidebar">{venue.name}</p>
          <p className="short-description-sidebar" style={{ fontSize: 18 }}>
            {venue.config?.landingPageConfig.subtitle}
          </p>
          <div style={{ fontSize: 13 }}>
            <RenderMarkdown
              text={venue.config?.landingPageConfig.description}
            />
          </div>
        </InformationCard>
      </InformationLeftColumn>
      <VenueWithOverlay venue={venue} containerClassNames="conversation-space">
        {!seatedAtTable && parentVenueId && parentVenue && (
          <BackButton variant="simple" space={parentVenue} />
        )}
        <div className={`scrollable-area ${seatedAtTable && "at-table"}`}>
          {venue.description?.text && (
            <div className="row">
              <div className="col">
                <div className="description">
                  <RenderMarkdown text={venue.description?.text} />
                </div>
              </div>
            </div>
          )}
          <div className="container-in-row">
            <div className="video-wrapper">
              {seatedAtTable && (
                <TableHeader
                  seatedAtTable={seatedAtTable}
                  setSeatedAtTable={setSeatedAtTable}
                  venueId={venue.id}
                  venueName={venue.name}
                  tables={tables}
                />
              )}
              {seatedAtTable && (
                <div className="participants-container">
                  <Room
                    setSeatedAtTable={setSeatedAtTable}
                    venueId={venue.id}
                    roomName={`${venue.id}-${seatedAtTable}`}
                  />
                </div>
              )}
              {!seatedAtTable && (
                <TablesControlBar
                  containerClassName="ControlBar__container"
                  onToggleAvailableTables={toggleTablesVisibility}
                  showOnlyAvailableTables={showOnlyAvailableTables}
                />
              )}
            </div>
          </div>
          <div className="seated-area">
            <TablesUserList
              setSeatedAtTable={setSeatedAtTable}
              seatedAtTable={seatedAtTable}
              venueId={venue.id}
              TableComponent={TableComponent}
              joinMessage={venue.hideVideo === false}
              customTables={tables}
              showOnlyAvailableTables={showOnlyAvailableTables}
              venue={venue}
            />
          </div>
          <UserList
            usersSample={venue.recentUsersSample ?? ALWAYS_EMPTY_ARRAY}
            userCount={venue.recentUserCount ?? 0}
            activity={venue?.activity ?? "here"}
          />
        </div>
      </VenueWithOverlay>
    </>
  );
};
