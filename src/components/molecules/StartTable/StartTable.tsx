import React from "react";
import classNames from "classnames";
import { useAsyncFn } from "react-use";

import {
  TABLE_COLUMN_WIDTH,
  TABLE_COLUMN_HEIGHT,
  TABLE_COLUMN_INDENT,
  DEFAULT_TABLE_CAPACITY,
} from "settings";

import { updateVenueTable } from "api/table";

import { Table } from "types/Table";
import { VenueTemplate } from "types/venues";

import { currentVenueSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";

import "./StartTable.scss";

export interface StartTablePropsType {
  tables: Table[];
  newTable: Table;
}

export const StartTable: React.FC<StartTablePropsType> = ({
  tables,
  newTable,
}) => {
  const venue = useSelector(currentVenueSelector);

  const [table] = tables;
  const startTableWidth =
    table.columns &&
    venue?.template !== VenueTemplate.jazzbar &&
    (table.columns + 1) * TABLE_COLUMN_WIDTH;
  const startTableHeight =
    table.rows &&
    venue?.template !== VenueTemplate.jazzbar &&
    table.rows * TABLE_COLUMN_HEIGHT + TABLE_COLUMN_INDENT;

  const [{ loading: isUpdatingTables }, updateTables] = useAsyncFn(async () => {
    if (!venue?.id) return;

    await updateVenueTable({
      venueId: venue.id,
      tableOfUser: newTable,
      tables: [...tables, newTable],
      title: newTable.title,
      capacity: newTable.capacity ?? DEFAULT_TABLE_CAPACITY,
    });
  }, [newTable, tables, venue?.id]);

  const containerClasses = classNames("StartTable", {
    "StartTable--jazzbar": venue?.template === VenueTemplate.jazzbar,
  });

  return (
    <button
      disabled={isUpdatingTables}
      className={containerClasses}
      onClick={updateTables}
      style={{
        height: `${startTableHeight}px`,
        width: `${startTableWidth}px`,
      }}
    >
      <div className="StartTable__sign">+</div>
      <div className="StartTable__title">Start a table</div>
    </button>
  );
};
