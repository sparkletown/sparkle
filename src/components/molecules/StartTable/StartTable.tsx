import React from "react";
import { useAsyncFn } from "react-use";
import classNames from "classnames";

import { updateVenueTable } from "api/table";

import { Table } from "types/Table";
import { AnyVenue, VenueTemplate } from "types/venues";

import { WithId } from "utils/id";

import { Loading } from "components/molecules/Loading";

import "./StartTable.scss";

export interface StartTablePropsType {
  defaultTables: Table[];
  newTable: Table;
  venue: WithId<AnyVenue>;
}

export const StartTable: React.FC<StartTablePropsType> = ({
  defaultTables,
  newTable,
  venue,
}) => {
  const venueId = venue.id;

  const [{ loading: isUpdatingTables }, updateTables] = useAsyncFn(async () => {
    if (!venueId) return;

    await updateVenueTable({
      venueId,
      newTable,
      defaultTables,
    });
  }, [newTable, venueId, defaultTables]);

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
