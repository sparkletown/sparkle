import React, { useMemo } from "react";
import { TabBar } from "components/admin/TabBar";

import { ADMIN_IA_WORLD_EDIT_PARAM_URL } from "settings";

import { generateUrl } from "utils/url";

import { useWorldParams } from "hooks/worlds/useWorldParams";

import { WorldNavLabelMap } from "./WorldNavLabelMap";

export const WorldNav: React.FC = () => {
  const { worldSlug, selectedTab } = useWorldParams();

  const tabs = useMemo(() => {
    return Object.fromEntries(
      Object.entries(WorldNavLabelMap).map(([key, label]) => {
        const url = generateUrl({
          route: ADMIN_IA_WORLD_EDIT_PARAM_URL,
          required: ["worldSlug", "selectedTab"],
          params: { worldSlug, selectedTab: key },
        });

        return [key, { url, label }];
      })
    );
  }, [worldSlug]);

  return (
    <div className="AdminVenueView__options -mb-px flex bg-white shadow">
      <TabBar tabs={tabs} selectedTab={selectedTab} />
    </div>
  );
};
