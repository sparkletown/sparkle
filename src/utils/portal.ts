import { DEFAULT_PORTAL_IS_CLICKABLE } from "settings";

import { RoomType } from "types/rooms";

import { isDefined } from "./types";

export const convertPortalTypeToClickability: (
  type: RoomType | undefined
) => boolean = (type) =>
  isDefined(type) ? type !== RoomType.unclickable : DEFAULT_PORTAL_IS_CLICKABLE;

export const convertClickabilityToPortalType: (
  type: boolean | undefined
) => undefined | RoomType.unclickable = (type) =>
  type ? undefined : RoomType.unclickable;
