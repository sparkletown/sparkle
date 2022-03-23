import { SpaceInfoItem } from "settings";

import { ChatSettings } from "types/chat";
import { UserId } from "types/id";
import { SparkleSelector } from "types/SparkleSelector";
import { WorldGeneralFormInput } from "types/world";

import { WithOptionalWorldId } from "utils/id";

export const shouldRetainAttendanceSelector: SparkleSelector<boolean> = (
  state
) => state.attendance.retainAttendance;

export const chatVisibilitySelector: SparkleSelector<boolean> = (state) =>
  state.chat.isChatSidebarVisible;

export const userProfileSelector: SparkleSelector<UserId | undefined> = (
  state
) => state.userProfile.userId;

export const selectedChatSettingsSelector: SparkleSelector<ChatSettings> = (
  state
) => state.chat.settings;

export const worldEditStartValuesSelector: SparkleSelector<
  Partial<WithOptionalWorldId<WorldGeneralFormInput>>
> = (state) => state.worldEditStartValues;

export const spaceCreateItemSelector: SparkleSelector<SpaceInfoItem> = (
  state
) => state.spaceCreateItem;
