import React from "react";
import { useAsyncFn } from "react-use";
import classNames from "classnames";

import { DEFAULT_TABLE_CAPACITY } from "settings";

import { updateVenueTable } from "api/table";

import { Table } from "types/Table";
import { AnyVenue, VenueTemplate } from "types/venues";

import { WithId } from "utils/id";

import { Loading } from "components/molecules/Loading";

import "./StartTable.scss";

export interface StartTablePropsType {
  tables: Table[];
  newTable: Table;
  venue: WithId<AnyVenue>;
}

export const StartTable: React.FC<StartTablePropsType> = ({
  tables,
  newTable,
  venue,
}) => {
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
    >
      <Loading containerClassName="StartTable__loading" />
      <div className="StartTable__sign">+</div>
      <div className="StartTable__title">Start a table</div>
    </button>
  );
};
