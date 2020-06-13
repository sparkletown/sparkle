import React, { useState } from "react";
import JazzBarSkeletonPage from "../JazzBarSkeletonPage";
import useProfileInformationCheck from "hooks/useProfileInformationCheck";

import Jazz from "../Jazz";
import Backstage from "../Backstage";
import Cocktail from "../Cocktail";
import { User } from "components/organisms/UserProfileModal/UserProfileModal";

const LoggedInPartyPage: React.FunctionComponent = () => {
  const [selectedTab, setSelectedTab] = useState("jazz");
  useProfileInformationCheck();

  const [userList, setUserList] = useState<User[]>([]);

  return (
    <JazzBarSkeletonPage
      userList={userList}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
    >
      <div className="col content-column">
        <div className={`row ${selectedTab === "smoking" ? "reduced" : ""}`}>
          {selectedTab === "jazz" && <Jazz setUserList={setUserList} />}
          {selectedTab === "cocktail" && <Cocktail setUserList={setUserList} />}
          {selectedTab === "smoking" && <Backstage setUserList={setUserList} />}
        </div>
      </div>
    </JazzBarSkeletonPage>
  );
};

export default LoggedInPartyPage;
