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
  },
  {
    label: "Show title on hover",
    value: RoomVisibility.hover,
    subtitle: "Venue title",
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
