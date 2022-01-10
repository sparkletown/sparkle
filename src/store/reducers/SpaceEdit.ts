import { SpaceInfoItem } from "settings";

import {
  SPACE_CREATE_PORTAL_ITEM,
  SpaceEditActions,
} from "store/actions/SpaceEdit";

export const spaceCreateItemReducer: (
  state: SpaceInfoItem | null,
  action: SpaceEditActions
) => SpaceInfoItem | null = (state = null, action) =>
  action.type === SPACE_CREATE_PORTAL_ITEM
    ? action.payload
      ? { ...action.payload }
      : null
    : state;
