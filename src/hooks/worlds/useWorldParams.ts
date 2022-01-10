import { useParams } from "react-router";

import { WorldNavTab, WorldSlug } from "types/world";

export interface WorldEditParams {
  worldId?: string;
  worldSlug?: WorldSlug;
  selectedTab?: WorldNavTab;
}

export const useWorldParams = () => {
  const {
    worldId,
    worldSlug,
    selectedTab = WorldNavTab.general,
  } = useParams<WorldEditParams>();

  return { worldId, worldSlug, selectedTab };
};
