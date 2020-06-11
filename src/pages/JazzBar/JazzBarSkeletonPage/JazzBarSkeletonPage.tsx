import React, { useState } from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import UserList from "components/molecules/UserList";
import TablesUserList from "components/molecules/TablesUserList";
import TabNavigation from "components/molecules/TabNavigation";
import "./JazzBarSkeletonPage.scss";
import InformationCard from "components/molecules/InformationCard";
import Chatbox from "components/organisms/Chatbox";

interface PropsType {
  users: any;
  selectedTab: string;
  children: React.ReactNode;
  setSelectedTab: (value: string) => void;
}

const JazzBarSkeletonPage: React.FunctionComponent<PropsType> = ({
  users,
  selectedTab,
  children,
  setSelectedTab,
}) => {
  const [isLeftColumnExpanded, setIsLeftColumnExpanded] = useState(false);

  return (
    <div className="full-page-container">
      <WithNavigationBar>
        <div className="jazz-bar-skeleton-page-container">
          <div
            className={`left-column ${isLeftColumnExpanded ? "expanded" : ""}`}
            onClick={() => setIsLeftColumnExpanded(!isLeftColumnExpanded)}
          >
            <img
              src="/kansas-smittys-logo-red.png"
              alt="Kansas Smittys"
              className={`band-logo ${isLeftColumnExpanded ? "expanded" : ""}`}
            />
            {isLeftColumnExpanded && (
              <>
                <InformationCard title="About the venue">
                  Kansas Smitty’s is East London’s most dynamic jazz venue.
                  Located on Broadway Market, it opens six nights a week for
                  live jazz in an intimate basement environment. Their
                  seven-piece house band share the name. The signature cocktail
                  in this cult bar, the julep, is a bourbon-based cocktail
                  served in an ice-filled tin, and recalls the jazzy bars of
                  1920s Kansas where the likes of Mary Lou Williams gave us new
                  ways of hearing.
                </InformationCard>
                <InformationCard title="About tonight’s gig:">
                  Tonight, the Kansas Smitty’s House Band are playing from their
                  new album, Things Happened Here. Drawing influence from over
                  one hundred years of jazz history, from Django Reinhardt to
                  Ahmad Jamal, and the vivid musical landscapes of Debussy and
                  even Brian Eno, Kansas Smitty’s new album combines journeying
                  into the jazz sublime with every flavour of cinematic texture.
                </InformationCard>
              </>
            )}
          </div>
          <div className="content">{children}</div>
          <div className="right-column">
            <TabNavigation
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
            <div className="right-column-content">
              {users && (
                <div className="user-list">
                  {selectedTab === "jazz" ? (
                    <TablesUserList users={users} limit={28} />
                  ) : (
                    <UserList users={users} limit={28} />
                  )}
                </div>
              )}
              <Chatbox />
            </div>
          </div>
        </div>
      </WithNavigationBar>
    </div>
  );
};

export default JazzBarSkeletonPage;
