import {
  faCogs,
  faDoorOpen,
  faFlagCheckered,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

import { WorldNavTab } from "components/organisms/WorldForm/components/WorldNav/WorldNavTab";

export const WorldNavIconMap: Readonly<
  Record<WorldNavTab, IconDefinition>
> = Object.freeze({
  [WorldNavTab.start]: faFlagCheckered,
  [WorldNavTab.entrance]: faDoorOpen,
  [WorldNavTab.advanced]: faCogs,
});
