import { useMemo, useCallback } from "react";

import { Table } from "types/Table";
import { ReactHook } from "types/utility";
import { User } from "types/User";

import { currentVenueSelectorData } from "utils/selectors";
import { experienceSelector } from "utils/selectors";
import { getUserExperience } from "utils/user";

import { useSelector } from "hooks/useSelector";
import { useRecentVenueUsers } from "hooks/users";

export interface UseTablesProps {
  defaultTables: Table[];
  showAvailableTables: boolean;
}

export interface UseTablesData {
  tablesToShow: Table[];
}

export const useTables: ReactHook<UseTablesProps, UseTablesData> = ({
  defaultTables,
  showAvailableTables,
}) => {
  const venue = useSelector(currentVenueSelectorData);
  const { recentVenueUsers } = useRecentVenueUsers({ venueName: venue?.name });
  const experience = useSelector(experienceSelector);

  const isLockedTable = useCallback(
    (table: Table) => experience?.tables[table.title]?.locked,
    [experience?.tables]
  );

  const isFullTable = useCallback(
    (table: Table) => {
      const usersSeatedAtTable = recentVenueUsers.filter(
        (user: User) =>
          getUserExperience(venue?.name)(user)?.table === table.reference
      );
      const numberOfSeatsLeft =
        table.capacity && table.capacity - usersSeatedAtTable.length;

      return numberOfSeatsLeft === 0;
    },
    [recentVenueUsers, venue?.name]
  );

  const tablesToShow = useMemo(
    () =>
      defaultTables.filter((table) => {
        return showAvailableTables
          ? !(isLockedTable(table) || isFullTable(table))
          : table;
      }),
    [defaultTables, showAvailableTables, isLockedTable, isFullTable]
  );

  return {
    tablesToShow,
  };
};
