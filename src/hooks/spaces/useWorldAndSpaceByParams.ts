import { LoadStatus } from "types/fire";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";

import { useWorldAndSpaceBySlug } from "./useWorldAndSpaceBySlug";

type UseWorldAndSpaceByParams = () => LoadStatus &
  ReturnType<typeof useSpaceParams> &
  ReturnType<typeof useWorldAndSpaceBySlug>;

export const useWorldAndSpaceByParams: UseWorldAndSpaceByParams = () => {
  const params = useSpaceParams();
  const result = useWorldAndSpaceBySlug(params);

  return {
    ...params,
    ...result,
  };
};
