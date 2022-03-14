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
  space: WithId<AnyVenue>;
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
