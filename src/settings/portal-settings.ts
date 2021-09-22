import { RoomVisibility } from "types/venues";

type LabelOption = { label: string; value: string };

export const LABEL_VISIBILITY_OPTIONS: LabelOption[] = [
  { label: "Always", value: RoomVisibility.nameCount },
  { label: "On Hover", value: RoomVisibility.hover },
  { label: "Count only", value: RoomVisibility.count },
  { label: "No Label", value: RoomVisibility.none },
  { label: "Unclickable", value: RoomVisibility.unclickable },
];
