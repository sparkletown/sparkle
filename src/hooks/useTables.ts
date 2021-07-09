import { useMemo } from "react";

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
}

export interface UseTablesData {
  availableTables: Table[];
}

export const useTables: ReactHook<UseTablesProps, UseTablesData> = ({
  defaultTables,
}) => {
  const venue = useSelector(currentVenueSelectorData);
  const { recentVenueUsers } = useRecentVenueUsers({ venueName: venue?.name });
  const experience = useSelector(experienceSelector);

  const availableTables = useMemo(
    () =>
      defaultTables.filter((table) => {
        const lockedTable = experience?.tables[table.title]?.locked;
        const areUsersAtTable = recentVenueUsers.some(
          (user: User) =>
            getUserExperience(venue?.name)(user)?.table === table.title
        );

        return !lockedTable && !areUsersAtTable;
      }),
    [defaultTables, experience?.tables, recentVenueUsers, venue?.name]
  );

  return {
    availableTables,
  };
};
