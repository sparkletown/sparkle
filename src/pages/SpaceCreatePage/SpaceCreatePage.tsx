import React from "react";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

import { Header } from "components/admin/Header";
import { SpaceCreateForm } from "components/admin/SpaceCreateForm";
import { AdminRestricted } from "components/atoms/AdminRestricted";
import { AdminLayout } from "components/layouts/AdminLayout";
import { Loading } from "components/molecules/Loading";
import { PortalShowcase } from "components/organisms/PortalShowcase";

import * as TW from "./SpaceCreatePage.tailwind";

import CN from "./SpaceCreatePage.module.scss";

export const SpaceCreatePage: React.FC = () => {
  const { worldSlug } = useSpaceParams();
  const { isLoaded: isWorldLoaded, worldId } = useWorldBySlug(worldSlug);

  return (
    <AdminLayout>
      <AdminRestricted>
        <div className={CN.spaceCreatePage}>
          <Header />
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
