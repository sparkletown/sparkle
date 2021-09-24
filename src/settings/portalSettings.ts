import { RoomVisibility } from "types/venues";

export type LabelVisibilityOption = {
  label: string;
  value: string;
};

export const LABEL_VISIBILITY_OPTIONS: LabelVisibilityOption[] = [
  {
    label: "Always",
    value: RoomVisibility.nameCount,
  },
  {
    label: "On Hover",
    value: RoomVisibility.hover,
  },
  {
    label: "Count only",
    value: RoomVisibility.count,
  },
  {
    label: "No Label",
    value: RoomVisibility.none,
  },
  {
    label: "Unclickable",
    value: RoomVisibility.unclickable,
  },
];
