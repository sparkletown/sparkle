import React from "react";
import { AdminRestrictedLoading } from "components/admin/AdminRestrictedLoading";
import { AdminRestrictedMessage } from "components/admin/AdminRestrictedMessage";
import { Header } from "components/admin/Header";
import { SpaceCreateForm } from "components/admin/SpaceCreateForm";
import { AdminLayout } from "components/layouts/AdminLayout";
import { WithPermission } from "components/shared/WithPermission";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

import { PortalShowcase } from "components/organisms/PortalShowcase";

import { Loading } from "components/molecules/Loading";

import * as TW from "./SpaceCreatePage.tailwind";

import CN from "./SpaceCreatePage.module.scss";

export const SpaceCreatePage: React.FC = () => {
  const { worldSlug } = useSpaceParams();
  const { isLoaded: isWorldLoaded, worldId } = useWorldBySlug(worldSlug);

  return (
    <AdminLayout>
      <WithPermission
        check="world"
        loading={<AdminRestrictedLoading />}
        fallback={<AdminRestrictedMessage />}
      >
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
      </WithPermission>
    </AdminLayout>
  );
};
