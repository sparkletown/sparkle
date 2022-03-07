import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import * as TW from "./TabBar.tailwind";

type TabDefinition = {
  label: string;
  url: string;
};

interface TabBarProps {
  tabs: Record<string, TabDefinition>;
  selectedTab: string;
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, selectedTab }) => {
  const renderedTabs = useMemo(() => {
    return Object.entries(tabs).map(([key, { url, label }]) => {
      const classes = classNames(TW.tab, {
        [TW.selectedTab]: selectedTab === key,
        [TW.notSelectedTab]: selectedTab !== key,
      });

      return (
        <Link key={key} to={url} className={classes}>
          {label}
        </Link>
      );
    });
  }, [selectedTab, tabs]);

  return <div className="-mb-px flex bg-white shadow">{renderedTabs}</div>;
};
