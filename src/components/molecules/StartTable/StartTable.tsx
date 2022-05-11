import React from "react";
import { useAsyncFn } from "react-use";
import { Button } from "components/attendee/Button";

import { updateVenueTable } from "api/table";

import { SpaceWithId } from "types/id";
import { Table } from "types/Table";

import { Loading } from "components/molecules/Loading";

import styles from "./StartTable.module.scss";

export interface StartTablePropsType {
  defaultTables: Table[];
  newTable: Table;
  space: SpaceWithId;
}

export const StartTable: React.FC<StartTablePropsType> = ({
  defaultTables,
  newTable,
  space,
}) => {
  const spaceId = space.id;

  const [{ loading: isUpdatingTables }, updateTables] = useAsyncFn(async () => {
    if (!spaceId) return;

    await updateVenueTable({
      venueId: spaceId,
      newTable,
      defaultTables,
    });
  }, [newTable, spaceId, defaultTables]);

  return isUpdatingTables ? (
    <Loading />
  ) : (
    <Button
      disabled={isUpdatingTables}
      className={styles.startTableButton}
      onClick={updateTables}
      variant="primary"
    >
      Start a table
    </Button>
  );
};
