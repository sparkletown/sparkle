import React, { useState } from "react";
import JazzBarSkeletonPage from "../JazzBarSkeletonPage";

import Backstage from "../Backstage";

interface PropsType {
  users: any;
}

const LoggedInPartyPage: React.FunctionComponent<PropsType> = ({ users }) => {
  const [selectedTab, setSelectedTab] = useState("band");

  return (
    <JazzBarSkeletonPage
      users={users}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
    >
      {selectedTab === "band" && (
        <div className="fake-component">Band Component</div>
      )}
      {selectedTab === "bar" && (
        <div className="fake-component">Bar Component</div>
      )}
      {selectedTab === "backstage" && (
        <div className="fake-component">
          <Backstage />
        </div>
      )}
    </JazzBarSkeletonPage>
  );
};

export default LoggedInPartyPage;
