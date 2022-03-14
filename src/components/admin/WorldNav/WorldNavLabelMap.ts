import { WorldNavTab } from "types/world";

export const WorldNavLabelMap: Readonly<
  Record<WorldNavTab, string>
> = Object.freeze({
  [WorldNavTab.general]: "Start",
  [WorldNavTab.entrance]: "Entrance",
  [WorldNavTab.advanced]: "Advanced",
});
