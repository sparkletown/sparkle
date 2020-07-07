import React from "react";
import "./TabNavigation.scss";
import { useSelector } from "react-redux";

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
}) => {
  const { venue } = useSelector((state: any) => ({
    venue: state.firestore.data.currentVenue,
  }));
  return (
    <div className="tab-navigation-container">
      {tabsArray.map((tab) => (
        <div
          key={`${tab.id}-tab`}
          className={`col tab-item ${
            selectedTab === tab.id ? "selected-tab-item" : ""
          }`}
          id={`change-tab-${venue.name}-${tab.id}`}
          onClick={() => setSelectedTab(tab.id)}
        >
          {tab.name}
        </div>
      ))}
    </div>
  );
};

export default TabNavigation;
