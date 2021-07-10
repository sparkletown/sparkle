import React from "react";
import classNames from "classnames";

import { Checkbox } from "components/atoms/Checkbox";

import "./TablesControlBar.scss";

export interface TablesControlBarProps {
  showAvailableTables: boolean;
  onToggleAvailableTables: () => void;
  containerClassName?: string;
}

export const TablesControlBar: React.FC<TablesControlBarProps> = ({
  showAvailableTables,
  onToggleAvailableTables,
  containerClassName,
}) => {
  const containerClasses = classNames("TablesControlBar", containerClassName);

  return (
    <div className={containerClasses}>
      <Checkbox
        checked={showAvailableTables}
        onChange={onToggleAvailableTables}
        label="Hide full/locked tables"
        containerClassName="TablesControlBar__checkbox"
      />
    </div>
  );
};
