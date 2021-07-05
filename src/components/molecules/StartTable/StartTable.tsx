import React from "react";
import { useAsyncFn } from "react-use";

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
    (table.columns + 1) * 55;

  const [, updateTables] = useAsyncFn(async () => {
    if (!venue?.id) return;

    await updateVenueTable({
      venueId: venue.id,
      tableOfUser: newTable,
      tables: [...tables, newTable],
      title: newTable.title,
      // TODO: fix default capacity
      capacity: newTable.capacity ?? 6,
    });
  }, [newTable, tables, venue?.id]);

  return (
    <div
      className="StartTable"
      onClick={updateTables}
      style={{
        height: `${table.rows && table.rows * 50 + 65}px`,
        width: `${startTableWidth}px`,
      }}
    >
      <div className="StartTable-sign">+</div>
      <div className="StartTable-title">Start a table</div>
    </div>
  );
};
