import { SpaceInfoItem } from "settings";

import { ChatSettings } from "types/chat";
import { SparkleSelector } from "types/SparkleSelector";
import { WorldGeneralFormInput } from "types/world";

import { WithOptionalWorldId } from "utils/id";

export const chatVisibilitySelector: SparkleSelector<boolean> = (state) =>
  state.chat.isChatSidebarVisible;

export const userProfileSelector: SparkleSelector<string | undefined> = (
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
