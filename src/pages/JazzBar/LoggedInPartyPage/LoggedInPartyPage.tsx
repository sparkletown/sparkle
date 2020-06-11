import React, { useState } from "react";
import JazzBarSkeletonPage from "../JazzBarSkeletonPage";
import useProfileInformationCheck from "hooks/useProfileInformationCheck";

import Jazz from "../Jazz";
import Backstage from "../Backstage";
import Cocktail from "../Cocktail";

interface PropsType {
  users: any;
}

const LoggedInPartyPage: React.FunctionComponent<PropsType> = ({ users }) => {
  const [selectedTab, setSelectedTab] = useState("jazz");
  useProfileInformationCheck();

  return (
    <JazzBarSkeletonPage
      users={users}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
    >
      <div className="col content-column">
        <div className={`row ${selectedTab === "smoking" ? "reduced" : ""}`}>
          {selectedTab === "jazz" && <Jazz />}
          {selectedTab === "cocktail" && <Cocktail />}
          {selectedTab === "smoking" && <Backstage />}
        </div>
      </div>
    </JazzBarSkeletonPage>
  );
};

export default LoggedInPartyPage;
