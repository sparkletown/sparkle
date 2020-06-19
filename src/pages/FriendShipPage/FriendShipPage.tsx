import React from "react";
import { useSelector } from "react-redux";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import InformationLeftColumn from "components/organisms/InformationLeftColumn";
import InformationCard from "components/molecules/InformationCard";
import Chatbox from "components/organisms/Chatbox";
import Room from "components/organisms/Room";
import TablesUserList from "components/molecules/TablesUserList";
import useUpdateLocationEffect from "utils/useLocationUpdateEffect";

const FriendShipPage = () => {
  const { user } = useSelector((state: any) => ({
    user: state.user,
  }));

  useUpdateLocationEffect(user, "Friend Ship");

  return (
    <WithNavigationBar>
      <div className="full-page-container experience-container">
        <InformationLeftColumn experienceLogoPath="/kansas-smittys-logo-red.png">
          <InformationCard title="About the venue">Hello World</InformationCard>
          <InformationCard
            title="About tonight's show"
            className="information-card"
          >
            tonight is going to be a great party
          </InformationCard>
        </InformationLeftColumn>
        <div className="content">
          <div className="wrapper">
            <Room roomName="friendship" setUserList={() => null} />
          </div>
        </div>
        <div className="right-column">
          <div className="right-column-content">
            <div className="table-container">
              <TablesUserList
                experienceName="friendship"
                limit={24}
                setUserList={() => null}
              />
            </div>
            <Chatbox room="friendship" />
          </div>
        </div>
      </div>
    </WithNavigationBar>
  );
};

export default FriendShipPage;
