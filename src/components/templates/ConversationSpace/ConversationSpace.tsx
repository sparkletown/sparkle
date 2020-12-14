import React, { useState } from "react";

import { LOC_UPDATE_FREQ_MS } from "settings";

import { currentVenueSelectorData, partygoersSelector } from "utils/selectors";

import { useInterval } from "hooks/useInterval";
import { useSelector } from "hooks/useSelector";

import ChatDrawer from "components/organisms/ChatDrawer";
import InformationLeftColumn from "components/organisms/InformationLeftColumn";
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
  const users = useSelector(partygoersSelector);

  const [isLeftColumnExpanded, setIsLeftColumnExpanded] = useState(false);
  const [seatedAtTable, setSeatedAtTable] = useState("");
  const [nowMs, setNowMs] = useState(Date.now());

  useInterval(() => {
    setNowMs(Date.now());
  }, LOC_UPDATE_FREQ_MS);

  if (!venue) return <>Loading...</>;

  const tables = venue?.config?.tables ?? TABLES;

  const venueUsers = users
    ? users.filter(
        (user) =>
          user.lastSeenIn &&
          user.lastSeenIn[venue.name] > (nowMs - LOC_UPDATE_FREQ_MS * 2) / 1000
      )
    : [];

  return (
    <>
      <InformationLeftColumn
        venueLogoPath={venue?.host?.icon ?? ""}
        isLeftColumnExpanded={isLeftColumnExpanded}
        setIsLeftColumnExpanded={setIsLeftColumnExpanded}
      >
        <InformationCard title="About the venue">
          <p className="title-sidebar">{venue.name}</p>
          <p className="short-description-sidebar" style={{ fontSize: 18 }}>
            {venue.config?.landingPageConfig.subtitle}
          </p>
          <p style={{ fontSize: 13 }}>
            {venue.config?.landingPageConfig.description}
          </p>
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
                <div className="description">{venue.description?.text}</div>
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
            users={venueUsers}
            activity={venue?.activity ?? "here"}
            disableSeeAll={false}
          />
        </div>
        <div className="chat-drawer">
          <ChatDrawer
            title={`${venue.name} Chat`}
            roomName={venue.name}
            chatInputPlaceholder="Message..."
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
