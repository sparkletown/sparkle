import React from "react";

import "./TabNavigation.scss";

interface TabType {
  id: string;
  name: string;
}

interface PropsType {
  selectedTab: string;
  setSelectedTab: (value: string) => void;
  tabsArray: TabType[];
}

const TabNavigation: React.FunctionComponent<PropsType> = ({
  selectedTab,
  setSelectedTab,
  tabsArray,
}) => (
  <div className="tab-navigation-container">
    {tabsArray.map((tab) => (
      <div
        key={`${tab.id}-tab`}
        className={`col tab-item ${
          selectedTab === tab.id ? "selected-tab-item" : ""
        }`}
        onClick={() => setSelectedTab(tab.id)}
        id={`change-tab-${tab.name}`}
      >
        {tab.name}
      </div>
    ))}
  </div>
);

export default TabNavigation;
