import { WorldNavTab } from "types/world";

export const WorldNavLabelMap: Readonly<Record<WorldNavTab, string>> =
  Object.freeze({
    [WorldNavTab.general]: "General settings",
    [WorldNavTab.entrance]: "Entrance",
    [WorldNavTab.advanced]: "Advanced",
  });
