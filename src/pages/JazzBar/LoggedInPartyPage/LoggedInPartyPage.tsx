import React, { useState } from "react";
import JazzBarSkeletonPage from "../JazzBarSkeletonPage";

interface PropsType {
  users: any;
}

const LoggedInPartyPage: React.FunctionComponent<PropsType> = ({ users }) => {
  const [selectedTab, setSelectedTab] = useState("jazz");

  return (
    <JazzBarSkeletonPage
      users={users}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
    >
      <div className="col content-column">
        <div className={`row ${selectedTab === "smoking" ? "reduced" : ""}`}>
          <iframe
            title="Jazz video"
            width="100%"
            height="100%"
            className={`col youtube-video ${
              selectedTab === "smoking" ? "reduced" : ""
            }`}
            src="https://www.youtube.com/embed/x0RV0kgdqJU"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
          {selectedTab === "smoking" && (
            <div className="col new-participant">+</div>
          )}
        </div>
      </div>
    </JazzBarSkeletonPage>
  );
};

export default LoggedInPartyPage;
