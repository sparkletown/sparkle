import { useMemo, useCallback } from "react";

import { Table } from "types/Table";
import { ReactHook } from "types/utility";
import { User } from "types/User";

import { experienceSelector } from "utils/selectors";
import { getUserExperience } from "utils/user";
import { WithId } from "utils/id";

import { useSelector } from "hooks/useSelector";

export interface UseAvailableTablesProps {
  tables: Table[];
  showAvailableTables: boolean;
  venueName: string;
  users: readonly WithId<User>[];
}

export interface UseAvailableTablesData {
  tablesToShow: Table[];
}

export const useAvailableTables: ReactHook<
  UseAvailableTablesProps,
  UseAvailableTablesData
> = ({ tables, showAvailableTables, venueName, users }) => {
  const experience = useSelector(experienceSelector);

  const isLockedTable = useCallback(
    (table: Table) => experience?.tables[table.title]?.locked,
    [experience?.tables]
  );

  const isFullTable = useCallback(
    (table: Table) => {
      const usersSeatedAtTable = users.filter(
        (user: User) =>
          getUserExperience(venueName)(user)?.table === table.reference
      );
      const numberOfSeatsLeft =
        table.capacity && table.capacity - usersSeatedAtTable.length;

      return numberOfSeatsLeft === 0;
    },
    [users, venueName]
  );

  const tablesToShow = useMemo(
    () =>
      tables.filter((table) => {
        return showAvailableTables
          ? !(isLockedTable(table) || isFullTable(table))
          : table;
      }),
    [tables, showAvailableTables, isLockedTable, isFullTable]
  );

  return {
    tablesToShow,
  };
};
