import React, { useCallback, useState } from "react";

import { ALWAYS_EMPTY_ARRAY, DEFAULT_USER_LIST_LIMIT } from "settings";

import { GenericVenue, VenueTemplate } from "types/venues";

import { WithId } from "utils/id";
import { openUrl, venueInsideUrl } from "utils/url";

import { useExperiences } from "hooks/useExperiences";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useShowHide } from "hooks/useShowHide";
import { useUpdateRecentSeatedTableUsers } from "hooks/useUpdateRecentSeatedUsers";

import { InformationLeftColumn } from "components/organisms/InformationLeftColumn";
import { RenderMarkdown } from "components/organisms/RenderMarkdown";
import Room from "components/organisms/Room";

import InformationCard from "components/molecules/InformationCard";
import TableComponent from "components/molecules/TableComponent";
import TableHeader from "components/molecules/TableHeader";
import { TablesControlBar } from "components/molecules/TablesControlBar";
import { TablesUserList } from "components/molecules/TablesUserList";
import { UserList } from "components/molecules/UserList";

import { BackButton } from "components/atoms/BackButton";

import { TABLES } from "./constants";

import "./ConversationSpace.scss";

export interface ConversationSpaceProps {
  venue: WithId<GenericVenue>;
}

export const ConversationSpace: React.FC<ConversationSpaceProps> = ({
  venue,
}) => {
  const { parentVenue, parentVenueId } = useRelatedVenues({
    currentVenueId: venue?.id,
  });

  const {
    isShown: showOnlyAvailableTables,
    toggle: toggleTablesVisibility,
  } = useShowHide();

  const [seatedAtTable, setSeatedAtTable] = useState<string>();

  useUpdateRecentSeatedTableUsers(
    VenueTemplate.conversationspace,
    seatedAtTable && venue?.id
  );

  useExperiences(venue?.name);

  // @debt This logic is a copy paste from NavBar. Move that into a separate Back button component
  const backToParentVenue = useCallback(() => {
    if (!parentVenueId) return;

    openUrl(venueInsideUrl(parentVenueId));
  }, [parentVenueId]);

  const tables = venue?.config?.tables ?? TABLES;

  return (
    <>
      <InformationLeftColumn iconNameOrPath={venue?.host?.icon}>
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
      <div className="conversation-space-container">
        {!seatedAtTable && parentVenueId && parentVenue && (
          <BackButton
            onClick={backToParentVenue}
            locationName={parentVenue.name}
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 3,
            flexBasis: 0,
            overflow: "hidden",
          }}
          className={`scrollable-area ${seatedAtTable && "at-table"}`}
        >
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
                    venueId={venue.id}
                    roomName={`${venue.name}-${seatedAtTable}`}
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
            />
          </div>
          <UserList
            users={venue.recentUsersSample ?? ALWAYS_EMPTY_ARRAY}
            activity={venue?.activity ?? "here"}
            limit={DEFAULT_USER_LIST_LIMIT}
            showMoreUsersToggler
          />
        </div>
      </div>
    </>
  );
};
