import React from "react";

import classNames from "classnames";

import { Checkbox } from "components/atoms/Checkbox";

import "./TablesControlBar.scss";

export interface TablesControlBarProps {
  isChecked: boolean;
  handleChecked: () => void;
  className?: string;
}

export const TablesControlBar: React.FC<TablesControlBarProps> = ({
  isChecked,
  handleChecked,
  className,
}) => {
  const containerClasses = classNames("TablesControlBar", className);

  return (
    <div className={containerClasses}>
      <Checkbox
        checked={isChecked}
        onChange={handleChecked}
        label="Hide full/locked tables"
        containerClassName="TablesControlBar__checkbox"
      />
    </div>
  );
};
