import React, { useState } from "react";
import JazzBarSkeletonPage from "../JazzBarSkeletonPage";

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
        <div className="col fake-component">Band Component</div>
      )}
      {selectedTab === "bar" && (
        <div className="col fake-component">Bar Component</div>
      )}
      {selectedTab === "backstage" && (
        <div className="col fake-component">Backstage Component</div>
      )}
    </JazzBarSkeletonPage>
  );
};

export default LoggedInPartyPage;
