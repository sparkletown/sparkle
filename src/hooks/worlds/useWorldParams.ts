import { useParams } from "react-router";

import { WorldNavTab } from "types/world";

export interface WorldEditParams {
  worldId?: string;
  worldSlug?: string;
  selectedTab?: WorldNavTab;
}

export const useWorldParams = () => {
  const {
    worldId,
    worldSlug,
    selectedTab = WorldNavTab.start,
  } = useParams<WorldEditParams>();

  return { worldId, worldSlug, selectedTab };
};
