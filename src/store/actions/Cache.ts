import { ReduxAction } from "types/redux";

import { WithId } from "utils/id";
import { User } from "types/User";

export enum CacheActionTypes {
  RELOAD_USER_CACHE = "RELOAD_USER_CACHE",
  INVALIDATE_USER_CACHE = "INVALIDATE_USER_CACHE",
  UPDATE_USER_CACHE = "UPDATE_USER_CACHE",
}

type ReloadUserCacheAction = ReduxAction<
  CacheActionTypes.RELOAD_USER_CACHE,
  {}
>;

type InvalidateUserCacheAction = ReduxAction<
  CacheActionTypes.INVALIDATE_USER_CACHE,
  { id: string }
>;

type UpdateUserCacheAction = ReduxAction<
  CacheActionTypes.UPDATE_USER_CACHE,
  {
    id: string;
    // eslint-disable-next-line
    user: WithId<User>;
  }
>;

export const reloadUserCache = (): ReloadUserCacheAction => ({
  type: CacheActionTypes.RELOAD_USER_CACHE,
  payload: {},
});

export const invalidateUserCache = (id: string): InvalidateUserCacheAction => ({
  type: CacheActionTypes.INVALIDATE_USER_CACHE,
  payload: { id },
});

// eslint-disable-next-line
export const updateUserCache = (
  id: string,
  user: WithId<User>
): UpdateUserCacheAction => ({
  type: CacheActionTypes.UPDATE_USER_CACHE,
  payload: { id, user },
});

export type CacheActions =
  | InvalidateUserCacheAction
  | UpdateUserCacheAction
  | ReloadUserCacheAction;
