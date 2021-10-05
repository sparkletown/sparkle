import { WorldNavTab } from "./WorldNavTab";

export const WorldNavLabelMap: Readonly<
  Record<WorldNavTab, string>
> = Object.freeze({
  [WorldNavTab.start]: "Start",
  [WorldNavTab.entrance]: "Entrance",
  [WorldNavTab.advanced]: "Advanced",
});
