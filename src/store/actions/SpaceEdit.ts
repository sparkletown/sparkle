import { SpaceInfoListItem } from "settings";

export const SPACE_CREATE_PORTAL_ITEM: string = "SPACE_CREATE_PORTAL_ITEM";

interface SpaceEditAction {
  type: typeof SPACE_CREATE_PORTAL_ITEM;
  payload?: SpaceInfoListItem | null;
}

export const spaceCreatePortalItem = (payload?: SpaceInfoListItem | null) => ({
  type: SPACE_CREATE_PORTAL_ITEM,
  payload: payload ?? null,
});

export type SpaceEditActions = SpaceEditAction;
