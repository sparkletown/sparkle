import { ReduxAction } from "types/redux";

//import { User } from "types/User";

export enum CacheActionTypes {
  UPDATE_USER = "SET_USER",
}

export type UpdateUserAction = ReduxAction<
  CacheActionTypes.UPDATE_USER,
  {
    id: string;
    // eslint-disable-next-line
    data: any;
  }
>;

export const updateUser = (
  id: string,
  // eslint-disable-next-line
  data: any
): UpdateUserAction => ({
  type: CacheActionTypes.UPDATE_USER,
  payload: { id, data },
});

export type CacheActions = UpdateUserAction;
