import {
  faSun as solidSun,
  faUserFriends as solidUsers,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

import { SPACE_TAXON } from "settings";

import { RoomVisibility } from "types/RoomVisibility";

export type VisibilityLabelOption = {
  label: string;
  value: RoomVisibility;
  subtitle?: { text: string; icon: IconDefinition }[];
};

export const LABEL_VISIBILITY_OPTIONS: Record<
  // @debt: please add a clarification (or link to such) as to why unclickable is excluded
  Exclude<RoomVisibility, RoomVisibility.unclickable>,
  VisibilityLabelOption
> = {
  [RoomVisibility.none]: {
    label: "No Label",
    value: RoomVisibility.none,
  },
  [RoomVisibility.hover]: {
    label: "Show title on hover",
    value: RoomVisibility.hover,
    subtitle: [{ text: `${SPACE_TAXON.title} title`, icon: solidSun }],
  },
  [RoomVisibility.count]: {
    label: "Show people count only",
    value: RoomVisibility.count,
    subtitle: [{ text: "123", icon: solidUsers }],
  },
  [RoomVisibility.nameCount]: {
    label: "Show title and people count",
    value: RoomVisibility.nameCount,
    subtitle: [
      { text: `${SPACE_TAXON.title} title`, icon: solidSun },
      { text: "123", icon: solidUsers },
    ],
  },
};

export const DEFAULT_PORTAL_IS_CLICKABLE = true;
export const DEFAULT_PORTAL_IS_ENABLED = true;
