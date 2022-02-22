import React from "react";
import { useAsyncFn } from "react-use";

import { updateVenueTable } from "api/table";

import { Table } from "types/Table";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { Loading } from "components/molecules/Loading";

import { ButtonNG } from "components/atoms/ButtonNG";

import styles from "./StartTable.module.scss";

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

  return isUpdatingTables ? (
    <Loading />
  ) : (
    <ButtonNG
      disabled={isUpdatingTables}
      className={styles.startTableButton}
      onClick={updateTables}
      variant="primary"
    >
      Start a table
    </ButtonNG>
  );
};
