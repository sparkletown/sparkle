import React from "react";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import { Checkbox } from "components/atoms/Checkbox";

import "./TablesControlBar.scss";

export interface TablesControlBarProps extends ContainerClassName {
  showOnlyAvailableTables: boolean;
  onToggleAvailableTables: () => void;
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
