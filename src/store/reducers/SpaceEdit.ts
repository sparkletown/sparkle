import { SpaceInfoListItem } from "settings";

import {
  SPACE_CREATE_PORTAL_ITEM,
  SpaceEditActions,
} from "store/actions/SpaceEdit";

export const spaceCreateItemReducer: (
  state: SpaceInfoListItem | null,
  action: SpaceEditActions
) => SpaceInfoListItem | null = (state = null, action) =>
  action.type === SPACE_CREATE_PORTAL_ITEM
    ? action.payload
      ? { ...action.payload }
      : null
    : state;
