import React from "react";
import { Header } from "components/admin/Header";
import { SpaceCreateForm } from "components/admin/SpaceCreateForm";
import { AdminLayout } from "components/layouts/AdminLayout";

import { ADMIN_IA_WORLD_PARAM_URL } from "settings";

import { spaceCreateItemSelector } from "utils/selectors";
import { generateUrl } from "utils/url";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useSelector } from "hooks/useSelector";
import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

import { PortalShowcase } from "components/organisms/PortalShowcase";

import { Loading } from "components/molecules/Loading";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import * as TW from "./SpaceCreatePage.tailwind";

import CN from "./SpaceCreatePage.module.scss";

export const SpaceCreatePage: React.FC = () => {
  const { worldSlug } = useSpaceParams();
  const { isLoaded: isWorldLoaded, worldId } = useWorldBySlug(worldSlug);
  const selectedItem = useSelector(spaceCreateItemSelector);
  const subtitle = [{ text: selectedItem?.text ?? "Select a template" }];
  const crumbtrail = [
    {
      name: "Spaces",
      href: generateUrl({
        route: ADMIN_IA_WORLD_PARAM_URL,
        required: ["worldSlug"],
        params: { worldSlug },
      }),
    },
  ];

  return (
    <AdminLayout>
      <AdminRestricted>
        <div className={CN.spaceCreatePage}>
          <Header
            title="Create Space"
            subtitleItems={subtitle}
            crumbtrail={crumbtrail}
          />
          <div className={TW.formContainer}>
            <div className={TW.spaceInfo}>
              {isWorldLoaded ? (
                <SpaceCreateForm worldId={worldId} />
              ) : (
                <Loading />
              )}
            </div>
            <div className={TW.preview}>
              <PortalShowcase />
            </div>
          </div>
        </div>
      </AdminRestricted>
    </AdminLayout>
  );
};
