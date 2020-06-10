import React from "react";
import "./TabNavigation.scss";

interface PropsType {
  selectedTab: string;
  setSelectedTab: (value: string) => void;
}

const TabNavigation: React.FunctionComponent<PropsType> = ({
  selectedTab,
  setSelectedTab,
}) => (
  <div className="row tab-navigation-container">
    <div
      className={`col tab-item ${
        selectedTab === "band" ? "selected-tab-item" : ""
      }`}
      onClick={() => setSelectedTab("band")}
    >
      Band
    </div>
    <div
      className={`col tab-item ${
        selectedTab === "bar" ? "selected-tab-item" : ""
      }`}
      onClick={() => setSelectedTab("bar")}
    >
      Bar
    </div>
    <div
      className={`col tab-item ${
        selectedTab === "backstage" ? "selected-tab-item" : ""
      }`}
      onClick={() => setSelectedTab("backstage")}
    >
      Backstage
    </div>
  </div>
);

export default TabNavigation;
