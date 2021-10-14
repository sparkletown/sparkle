import { useParams } from "react-router";

import { WorldNavTab } from "types/world";

export interface WorldEditParams {
  worldId?: string;
  selectedTab?: WorldNavTab;
}

export const useWorldEditParams = () => {
  const {
    worldId,
    selectedTab = WorldNavTab.start,
  } = useParams<WorldEditParams>();

  return { worldId, selectedTab };
};
