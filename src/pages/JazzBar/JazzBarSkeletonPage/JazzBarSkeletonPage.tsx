import React, { useState } from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import UserList from "components/molecules/UserList";
import TablesUserList from "components/molecules/TablesUserList";
import TabNavigation from "components/molecules/TabNavigation";
import InformationCard from "components/molecules/InformationCard";
import Chatbox from "components/organisms/Chatbox";
import InformationLeftColumn from "components/organisms/InformationLeftColumn";
import Room from "components/organisms/Room";
import { useSelector } from "react-redux";
import { User } from "types/User";
import JazzbarTableComponent from "components/molecules/JazzbarTableComponent";
import useUpdateLocationEffect from "utils/useLocationUpdateEffect";

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
  const [seatedAtTable, setSeatedAtTable] = useState("");

  let activity = "";
  if (selectedTab === "cocktail") {
    activity = "at the bar";
  }
  if (selectedTab === "smoking") {
    activity = "in the smoking area";
  }

  const { users, user } = useSelector((state: any) => ({
    users: state.firestore.ordered.partygoers,
    user: state.user,
  }));

  useUpdateLocationEffect(user, "Jazz Mountain");

  const usersSeated =
    users &&
    users.filter(
      (user: User) =>
        user.data?.["Jazz Mountain"] && !user.data["Jazz Mountain"].table
    );

  return (
    <WithNavigationBar>
      <div className="full-page-container experience-container">
        <InformationLeftColumn experienceLogoPath="/room-images/CRC_Island_JAZZ2.png">
          <InformationCard title="About the venue">
            Jazztastic Park is the Partypelago's most storied jazz venue. All
            flavours of this classic improvisational medium can be heard in the
            jungle-laden hills of this Northwesterly outcrop.
          </InformationCard>
          <InformationCard
            title="About tonight's show"
            className="information-card"
          >
            <p>Performing tonight at Jazztastic Park:</p>
            <ul>
              <li>
                Kansas Smitty's:
                <ul>
                  <li>Giacomo Smith - alto/clarinet</li>
                  <li>Alec harper - Tenor</li>
                  <li>Dave Archer - Guitar</li>
                  <li>Joe Webb - Piano</li>
                  <li>Ferg Ireland - Double Bass</li>
                  <li>Will Cleasby - Drums</li>
                </ul>
              </li>
              <li>Sam Leak</li>
            </ul>
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
                  <>
                    <div className="row header no-margin">
                      <p>
                        <span className="bold">
                          {users && usersSeated.length}
                        </span>{" "}
                        {users && usersSeated.length !== 1
                          ? "people"
                          : "person"}{" "}
                        listening to jazz
                      </p>
                    </div>
                    <div className="table-container">
                      <TablesUserList
                        experienceName="Jazz Mountain"
                        seatedAtTable={seatedAtTable}
                        setSeatedAtTable={setSeatedAtTable}
                        TableComponent={JazzbarTableComponent}
                        joinMessage={true}
                      />
                      {seatedAtTable !== "" && (
                        <>
                          <div className="wrapper">
                            <Room
                              roomName={seatedAtTable}
                              setUserList={setUserList}
                            />
                          </div>
                          <div className="header">
                            <UserList
                              users={users.filter(
                                (user: User) =>
                                  user.data?.["Jazz Mountain"]?.table !==
                                  seatedAtTable
                              )}
                              activity="on other tables"
                              disableSeeAll
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <UserList users={userList} activity={activity} limit={24} />
                )}
                {users && (
                  <div className="row no-margin">
                    <UserList
                      users={users.filter(
                        (user: User) => user.lastSeenIn === "Jazz Mountain"
                      )}
                      limit={22}
                      activity="standing"
                      disableSeeAll
                    />
                  </div>
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
