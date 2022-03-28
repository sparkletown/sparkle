import { SpaceInfoItem } from "settings";

import { UserProfileState } from "store/reducers/UserProfile";

import { ChatSettings } from "types/chat";
import { SparkleSelector } from "types/SparkleSelector";
import { WorldGeneralFormInput } from "types/world";

import { WithOptionalWorldId } from "utils/id";

export const shouldRetainAttendanceSelector: SparkleSelector<boolean> = (
  state
) => state.attendance.retainAttendance;

export const chatVisibilitySelector: SparkleSelector<boolean> = (state) =>
  state.chat.isChatSidebarVisible;

export const userProfileSelector: SparkleSelector<UserProfileState> = (state) =>
  state.userProfile;

export const selectedChatSettingsSelector: SparkleSelector<ChatSettings> = (
  state
) => state.chat.settings;

export const worldEditStartValuesSelector: SparkleSelector<
  Partial<WithOptionalWorldId<WorldGeneralFormInput>>
> = (state) => state.worldEditStartValues;

export const spaceCreateItemSelector: SparkleSelector<SpaceInfoItem> = (
  state
) => state.spaceCreateItem;
