import {
  faSun as solidSun,
  faUserFriends as solidUsers,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

import { SPACE_TAXON } from "settings/taxonomy";

import { RoomVisibility } from "types/venues";

type VisibilityOption = {
  label: string;
  value: RoomVisibility;
  subtitle?: { text: string; icon: IconDefinition }[];
};

export type LabelVisibilityOptions = {
  noLabel: VisibilityOption;
  hoverTitle: VisibilityOption;
  countOnly: VisibilityOption;
  titleAndCount: VisibilityOption;
};

export const LABEL_VISIBILITY_OPTIONS: LabelVisibilityOptions = {
  noLabel: {
    label: "No Label",
    value: RoomVisibility.none,
  },
  hoverTitle: {
    label: "Show title on hover",
    value: RoomVisibility.hover,
    subtitle: [{ text: `${SPACE_TAXON.title} title`, icon: solidSun }],
  },
  countOnly: {
    label: "Show people count only",
    value: RoomVisibility.count,
    subtitle: [{ text: "123", icon: solidUsers }],
  },
  titleAndCount: {
    label: "Show title and people count",
    value: RoomVisibility.nameCount,
    subtitle: [
      { text: `${SPACE_TAXON.title} title`, icon: solidUsers },
      { text: "123", icon: solidSun },
    ],
  },
};
