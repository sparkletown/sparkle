import { skipToken } from "@reduxjs/toolkit/dist/query/react";

import { useWorldUsersQueryState } from "store/api/worldUsers";

import { useWorldUsersContext } from "./useWorldUsers";

/**
 * @debt typing, Record implies that a User will exist for literally any given string, which is untrue
 * @deprecated Remove useWorldUsers from the codebase
 */
export const useWorldUsersById = () => {
  // We mostly use this here to ensure that the WorldUsersProvider has definitely been connected
  const { worldUsersApiArgs } = useWorldUsersContext();

  const {
    isSuccess: isWorldUsersByIdLoaded,
    worldUsersById,
  } = useWorldUsersQueryState(worldUsersApiArgs ?? skipToken, {
    selectFromResult: (result) => ({
      isSuccess: result.isSuccess,
      worldUsersById: result.data?.worldUsersById ?? {},
    }),
  });

  return {
    isWorldUsersLoaded: isWorldUsersByIdLoaded,
    worldUsersById,
  };
};
