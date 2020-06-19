import React from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import UserList from "components/molecules/UserList";
import TablesUserList from "components/molecules/TablesUserList";
import TabNavigation from "components/molecules/TabNavigation";
import InformationCard from "components/molecules/InformationCard";
import Chatbox from "components/organisms/Chatbox";
import InformationLeftColumn from "components/organisms/InformationLeftColumn";

interface PropsType {
  userList: any;
  selectedTab: string;
  children: React.ReactNode;
  setSelectedTab: (value: string) => void;
  setUserList: any;
}

const JazzBarSkeletonPage: React.FunctionComponent<PropsType> = ({
  userList,
  selectedTab,
  children,
  setSelectedTab,
  setUserList,
}) => {
  let activity = "";
  if (selectedTab === "cocktail") {
    activity = "at the bar";
  }
  if (selectedTab === "smoking") {
    activity = "in the smoking area";
  }

  return (
    <WithNavigationBar>
      <div className="full-page-container experience-container">
        <InformationLeftColumn experienceLogoPath="/kansas-smittys-logo-red.png">
          <InformationCard title="About the venue">
            Kansas Smitty’s is East London’s most dynamic jazz venue. Located on
            Broadway Market, it opens six nights a week for live jazz in an
            intimate basement environment. Their seven-piece house band share
            the name. The signature cocktail in this cult bar, the julep, is a
            bourbon-based cocktail served in an ice-filled tin, and recalls the
            jazzy bars of 1920s Kansas where the likes of Mary Lou Williams gave
            us new ways of hearing.
          </InformationCard>
          <InformationCard
            title="About tonight's show"
            className="information-card"
          >
            <p>Performing tonight at Kansas Smitty's:</p>
            <ul>
              <li>Giacomo Smith - alto/clarinet</li>
              <li>Alec harper - Tenor</li>
              <li>Dave Archer - Guitar</li>
              <li>Joe Webb - Piano</li>
              <li>Ferg Ireland - Double Bass</li>
              <li>Will Cleasby - Drums</li>
            </ul>
            <p>Broadcasting live from their East London home.</p>
          </InformationCard>
        </InformationLeftColumn>
        <div className="content">{children}</div>
        <div className="right-column">
          <TabNavigation
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
          <div className="right-column-content">
            {userList && (
              <div className="user-list">
                {selectedTab === "jazz" ? (
                  <TablesUserList
                    experienceName="Jazz Mountain"
                    limit={24}
                    setUserList={setUserList}
                  />
                ) : (
                  <UserList users={userList} activity={activity} limit={24} />
                )}
              </div>
            )}
            <Chatbox room={selectedTab} />
          </div>
        </div>
      </div>
    </WithNavigationBar>
  );
};

export default JazzBarSkeletonPage;
