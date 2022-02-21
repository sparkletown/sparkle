import { LoadStatus } from "types/fire";
import { MaybeWorldAndSpaceSlugLocation } from "types/id";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";

import { useWorldAndSpaceBySlug } from "./useWorldAndSpaceBySlug";

type UseWorldAndSpaceByParams = () => LoadStatus &
  MaybeWorldAndSpaceSlugLocation &
  Omit<ReturnType<typeof useWorldAndSpaceBySlug>, "error">;

export const useWorldAndSpaceByParams: UseWorldAndSpaceByParams = () => {
  const params = useSpaceParams();
  const { error, isLoaded, ...extra } = useWorldAndSpaceBySlug(params);

  return {
    ...params,
    ...extra,
    isLoading: !isLoaded,
    isLoaded,
    error: error ? new Error(error) : undefined,
  };
};
