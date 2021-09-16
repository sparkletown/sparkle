import React, { Dispatch, SetStateAction } from "react";
import classNames from "classnames";

const tabs = [
  { id: 0, title: "Spaces" },
  { id: 1, title: `What's on` },
];

type EmergencyViewTabsProps = {
  selectedTab: number;
  updateTab: Dispatch<SetStateAction<number>>;
};

const EmergencyViewTabs: React.FC<EmergencyViewTabsProps> = ({
  selectedTab,
  updateTab,
}) => {
  const tabClasses = (tabId: number) =>
    classNames("EmergencyView__item", {
      "EmergencyView__item--active": tabId === selectedTab,
    });

  return (
    <div className="EmergencyView__tabs">
      {tabs.map((tab) => {
        const classNameValue = tabClasses(tab.id);

        return (
          <div
            className={classNameValue}
            key={tab.id}
            onClick={() => updateTab(tab.id)}
          >
            {tab.title}
          </div>
        );
      })}
    </div>
  );
};

export default EmergencyViewTabs;
