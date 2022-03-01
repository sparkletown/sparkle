import React, { useMemo } from "react";
import { AdminRestrictedLoading } from "components/admin/AdminRestrictedLoading";
import { AdminRestrictedMessage } from "components/admin/AdminRestrictedMessage";
import { Header } from "components/admin/Header";
import { HeaderButton } from "components/admin/HeaderButton";
import { Section } from "components/admin/Section";
import { SectionHeading } from "components/admin/SectionHeading";
import { SectionTitle } from "components/admin/SectionTitle";
import { AdminLayout } from "components/layouts/AdminLayout";
import { FullWidthLayout } from "components/layouts/FullWidthLayout";
import { WithPermission } from "components/shared/WithPermission";
import { uniq } from "lodash/fp";

import { ADMIN_IA_WORLD_CREATE_URL } from "settings";

import { useSpacesByOwner } from "hooks/spaces/useSpacesByOwner";
import { usePermission } from "hooks/user/usePermission";
import { useUserId } from "hooks/user/useUserId";
import { useWorldsByNotHidden } from "hooks/worlds/useWorldsByNotHidden";
import { useWorldsByOwner } from "hooks/worlds/useWorldsByOwner";

import { AdminShowcaseTitle } from "components/organisms/AdminVenueView/components/AdminShowcaseTitle";

import { LoadingPage } from "components/molecules/LoadingPage";

import { WorldsTable } from "./WorldsTable";

import ARROW from "assets/images/admin/dashboard-arrow.svg";

export const WorldsDashboard: React.FC = () => {
  const { userId, isLoading } = useUserId();
  const { worlds } = useWorldsByNotHidden();
  const { ownWorlds } = useWorldsByOwner({ userId });
  const { ownSpaces } = useSpacesByOwner({ userId });
  const { isSuperAdmin } = usePermission({
    userId,
  });

  const visibleWorldIds = useMemo(
    () =>
      uniq([
        ...ownSpaces.map(({ worldId }) => worldId),
        ...ownWorlds.map((world) => world.id),
      ]),
    [ownSpaces, ownWorlds]
  );

  // NOTE: Firebase query where([world.id, 'in', visibleWorldIds]) has a limit of 10 items in visibleWorldIds. Because of that, it is filtered here
  const visibleWorlds = useMemo(
    () => worlds.filter(({ id }) => visibleWorldIds.includes(id)),
    [worlds, visibleWorldIds]
  );

  const hasWorlds = !!worlds.length;

  const renderedWelcomePage = useMemo(
    () => (
      <div className="WorldsDashboard__messages-container">
        <AdminShowcaseTitle>
          Start by creating
          <div>your first world</div>
        </AdminShowcaseTitle>
      </div>
    ),
    []
  );

  if (isLoading) return <LoadingPage />;

  return (
    <AdminLayout>
      <WithPermission
        check="super"
        loading={<AdminRestrictedLoading />}
        fallback={<AdminRestrictedMessage />}
      >
        {hasWorlds ? (
          <>
            <Header title="Switch World" />
            <FullWidthLayout>
              <Section>
                <SectionHeading>
                  <SectionTitle>My worlds</SectionTitle>
                  {isSuperAdmin && (
                    <HeaderButton
                      to={ADMIN_IA_WORLD_CREATE_URL}
                      name="Create new world"
                      variant="primary"
                    />
                  )}
                </SectionHeading>
                <WorldsTable worlds={visibleWorlds} />
              </Section>
            </FullWidthLayout>
          </>
        ) : (
          <FullWidthLayout>
            <div className="WorldsDashboard__arrow-header">
              <HeaderButton
                name="Create new world"
                to={ADMIN_IA_WORLD_CREATE_URL}
                variant="primary"
              />
              <img
                alt="arrow pointing towards the Create a world button"
                className="WorldsDashboard__arrow"
                src={ARROW}
              />
            </div>
            {renderedWelcomePage}
          </FullWidthLayout>
        )}
      </WithPermission>
    </AdminLayout>
  );
};
