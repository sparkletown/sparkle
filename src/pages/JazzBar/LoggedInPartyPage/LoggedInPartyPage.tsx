import React, { useState } from "react";
import JazzBarSkeletonPage from "../JazzBarSkeletonPage";
import useProfileInformationCheck from "hooks/useProfileInformationCheck";

import Backstage from "../Backstage";
import Cocktail from "../Cocktail";
import { User } from "components/organisms/UserProfileModal/UserProfileModal";

interface PropsType {
  users: any;
}

const LoggedInPartyPage: React.FunctionComponent<PropsType> = ({ users }) => {
  const [selectedTab, setSelectedTab] = useState("jazz");
  useProfileInformationCheck();

  const [userList, setUserList] = useState<User[]>([]);

  return (
    <JazzBarSkeletonPage
      users={selectedTab === "jazz" ? users : userList}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
    >
      <div className="col content-column">
        <div className={`row ${selectedTab === "smoking" ? "reduced" : ""}`}>
          {selectedTab === "jazz" && (
            <iframe
              title="main event"
              width="100%"
              height="100%"
              className={"col youtube-video"}
              src="https://www.youtube.com/embed/x0RV0kgdqJU"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          )}
          {selectedTab === "cocktail" && <Cocktail setUserList={setUserList} />}
          {selectedTab === "smoking" && <Backstage setUserList={setUserList} />}
        </div>
      </div>
    </JazzBarSkeletonPage>
  );
};

export default LoggedInPartyPage;
