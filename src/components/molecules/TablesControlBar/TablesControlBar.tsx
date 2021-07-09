import React, { useMemo, useCallback } from "react";
import classNames from "classnames";

import { Table } from "types/Table";
import { User } from "types/User";
import { AnyVenue } from "types/venues";

import { experienceSelector } from "utils/selectors";
import { WithId } from "utils/id";

import { useSelector } from "hooks/useSelector";

import { Checkbox } from "components/atoms/Checkbox";

import "./TablesControlBar.scss";

export interface TablesControlBarProps {
  defaultTables: Table[];
  isChecked: boolean;
  venue: AnyVenue;
  users: readonly WithId<User>[];
  onToggleTables: (value: React.SetStateAction<Table[]>) => void;
  className?: string;
}

export const TablesControlBar: React.FC<TablesControlBarProps> = ({
  defaultTables,
  isChecked,
  venue,
  users,
  onToggleTables,
  className,
}) => {
  const experience = useSelector(experienceSelector);

  // not locked and not full tables
  const freeTables = useMemo(
    () =>
      defaultTables
        .filter((table) => !experience?.tables[table.title]?.locked)
        .filter(
          (table) =>
            !users.filter(
              (u) => u.data?.[venue.name]?.table === table.reference
            ).length
        ),
    [defaultTables, experience?.tables, users, venue.name]
  );

  const toggleTables = useCallback(
    () => onToggleTables(isChecked ? defaultTables : freeTables),
    [isChecked, onToggleTables, defaultTables, freeTables]
  );

  const containerClasses = classNames("TablesControlBar", className);

  return (
    <div className={containerClasses}>
      <Checkbox
        checked={isChecked}
        onChange={toggleTables}
        label="Hide full/locked tables"
        containerClassName="TablesControlBar__checkbox"
      />
    </div>
  );
};
