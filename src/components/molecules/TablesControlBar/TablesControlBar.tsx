import React from "react";
import classNames from "classnames";

import { Checkbox } from "components/atoms/Checkbox";

import "./TablesControlBar.scss";

export interface TablesControlBarProps {
  showOnlyAvailableTables: boolean;
  onToggleAvailableTables: () => void;
  containerClassName?: string;
}

export const TablesControlBar: React.FC<TablesControlBarProps> = ({
  showOnlyAvailableTables,
  onToggleAvailableTables,
  containerClassName,
}) => {
  const containerClasses = classNames("TablesControlBar", containerClassName);

  return (
    <div className={containerClasses}>
      <Checkbox
        checked={showOnlyAvailableTables}
        onChange={onToggleAvailableTables}
        label="Hide full/locked tables"
        containerClassName="TablesControlBar__checkbox"
      />
    </div>
  );
};
