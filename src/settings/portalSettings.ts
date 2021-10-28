import { SPACE_TAXON } from "settings/taxonomy";

import { RoomVisibility } from "types/venues";

export type LabelVisibilityOption = {
  label: string;
  value: RoomVisibility;
  subtitle?: string;
};

export const LABEL_VISIBILITY_OPTIONS: LabelVisibilityOption[] = [
  {
    label: "No Label",
    value: RoomVisibility.none,
    subtitle: "",
  },
  {
    label: "Show title on hover",
    value: RoomVisibility.hover,
    subtitle: `${SPACE_TAXON.title} title`,
  },
  {
    label: "Show people count only",
    value: RoomVisibility.count,
    subtitle: "123",
  },
  {
    label: "Show title and people count",
    value: RoomVisibility.nameCount,
    subtitle: "Venue title, 123",
  },
];
