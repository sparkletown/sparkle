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
  <div className="tab-navigation-container">
    <div
      className={`col tab-item ${
        selectedTab === "jazz" ? "selected-tab-item" : ""
      }`}
      onClick={() => setSelectedTab("jazz")}
    >
      Jazz
    </div>
    <div
      className={`col tab-item ${
        selectedTab === "cocktail" ? "selected-tab-item" : ""
      }`}
      onClick={() => setSelectedTab("cocktail")}
    >
      Cocktail
    </div>
  </div>
);

export default TabNavigation;
