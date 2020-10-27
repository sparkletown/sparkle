import InformationCard from "components/molecules/InformationCard";
import TableComponent from "components/molecules/TableComponent";
import TableHeader from "components/molecules/TableHeader";
import TablesUserList from "components/molecules/TablesUserList";
import UserList from "components/molecules/UserList";
import ChatDrawer from "components/organisms/ChatDrawer";
import InformationLeftColumn from "components/organisms/InformationLeftColumn";
import Room from "components/organisms/Room";
import { useSelector } from "hooks/useSelector";
import React, { useEffect, useState } from "react";
import { LOC_UPDATE_FREQ_MS } from "settings";
import { TABLES } from "./constants";
import "./ConversationSpace.scss";

const ConversationSpace: React.FunctionComponent = () => {
  const { venue, users } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
    users: state.firestore.ordered.partygoers,
  }));

  const [isLeftColumnExpanded, setIsLeftColumnExpanded] = useState(false);
  const [seatedAtTable, setSeatedAtTable] = useState("");
  const [nowMs, setNowMs] = useState(new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setNowMs(new Date().getTime());
    }, LOC_UPDATE_FREQ_MS);

    return () => clearInterval(interval);
  }, [setNowMs]);

  if (!venue) return <>Loading...</>;

  const venueUsers = users
    ? users.filter(
        (user) =>
          user.lastSeenIn ??
          user.lastSeenIn[venue.name] > (nowMs - LOC_UPDATE_FREQ_MS * 2) / 1000
      )
    : [];

  return (
    <>
      <InformationLeftColumn
        venueLogoPath={venue?.host.icon ?? ""}
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
                  tables={TABLES}
                />
              )}
              {seatedAtTable && (
                <div className="participants-container">
                  <Room roomName={seatedAtTable} setUserList={() => {}} />
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
              customTables={TABLES}
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

export default ConversationSpace;
