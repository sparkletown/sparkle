import React, { useState } from "react";

import { currentVenueSelectorData } from "utils/selectors";

import { useSelector } from "hooks/useSelector";
import { useRecentVenueUsers } from "hooks/users";
import { useExperiences } from "hooks/useExperiences";

import { InformationLeftColumn } from "components/organisms/InformationLeftColumn";
import { RenderMarkdown } from "components/organisms/RenderMarkdown";
import Room from "components/organisms/Room";

import InformationCard from "components/molecules/InformationCard";
import TableComponent from "components/molecules/TableComponent";
import TableHeader from "components/molecules/TableHeader";
import TablesUserList from "components/molecules/TablesUserList";
import UserList from "components/molecules/UserList";

import { TABLES } from "./constants";

import "./ConversationSpace.scss";

export const ConversationSpace: React.FunctionComponent = () => {
  const venue = useSelector(currentVenueSelectorData);
  const { recentVenueUsers } = useRecentVenueUsers({ venueName: venue?.name });

  const [seatedAtTable, setSeatedAtTable] = useState("");

  useExperiences(venue?.name);

  if (!venue) return <>Loading...</>;

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
                  venueName={venue.name}
                  tables={tables}
                />
              )}
              {seatedAtTable && (
                <div className="participants-container">
                  <Room
                    venueName={venue.name}
                    roomName={`${venue.name}-${seatedAtTable}`}
                    setUserList={() => {}}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="seated-area">
            <TablesUserList
              setSeatedAtTable={setSeatedAtTable}
              seatedAtTable={seatedAtTable}
              venueName={venue.name}
              TableComponent={TableComponent}
              joinMessage={venue.hideVideo === false}
              customTables={tables}
            />
          </div>
          <UserList
            users={recentVenueUsers}
            activity={venue?.activity ?? "here"}
            disableSeeAll={false}
          />
        </div>
      </div>
    </>
  );
};

/**
 * @deprecated use named export instead
 */
export default ConversationSpace;
