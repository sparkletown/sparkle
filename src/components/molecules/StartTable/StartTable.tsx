import React from "react";
import { useAsyncFn } from "react-use";
import classNames from "classnames";

import { updateVenueTable } from "api/table";

import { Table } from "types/Table";
import { VenueTemplate } from "types/venues";

import { currentVenueSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";

import { Loading } from "components/molecules/Loading";

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
  const venueId = venue?.id;

  const [{ loading: isUpdatingTables }, updateTables] = useAsyncFn(async () => {
    if (!venueId) return;

    await updateVenueTable({
      venueId,
      newTable,
    });
  }, [newTable, venueId]);

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
