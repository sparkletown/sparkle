import React, { useMemo } from "react";
import { HeaderButton } from "components/admin/HeaderButton";
import { Section } from "components/admin/Section";
import { SectionHeading } from "components/admin/SectionHeading";
import { SectionTitle } from "components/admin/SectionTitle";
import { AdminLayout } from "components/layouts/AdminLayout";
import { FullWidthLayout } from "components/layouts/FullWidthLayout";
import { uniq } from "lodash/fp";

import { ADMIN_IA_WORLD_CREATE_URL } from "settings";

import { UserId } from "types/id";

import { useOwnedVenues } from "hooks/useOwnedVenues";
import { useAdminRole } from "hooks/user/useAdminRole";
import { useOwnWorlds } from "hooks/worlds/useOwnWorlds";
import { useWorlds } from "hooks/worlds/useWorlds";

import { AdminShowcaseTitle } from "components/organisms/AdminVenueView/components/AdminShowcaseTitle";

import { AdminHeader } from "components/atoms/AdminHeader";
import { AdminRestricted } from "components/atoms/AdminRestricted";

import { WorldsTable } from "./WorldsTable";

import ARROW from "assets/images/admin/dashboard-arrow.svg";

import "./WorldsDashboard.scss";

type WorldsDashboardProps = { userId: UserId };

export const WorldsDashboard: React.FC<WorldsDashboardProps> = ({ userId }) => {
  const { ownedVenues } = useOwnedVenues({ userId });
  const worlds = useWorlds();
  const { ownWorlds } = useOwnWorlds({ userId });

  const { isAdminUser: isSuperAdmin } = useAdminRole({ userId });

  const visibleWorldIds = useMemo(
    () =>
      uniq([
        ...ownedVenues.map(({ worldId }) => worldId),
        ...ownWorlds.map((world) => world.id),
      ]),
    [ownedVenues, ownWorlds]
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

  return (
    <AdminLayout>
      <AdminRestricted>
        {hasWorlds ? (
          <>
            <AdminHeader title="Switch World" />
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
              ></HeaderButton>
              <img
                alt="arrow pointing towards the Create a world button"
                className="WorldsDashboard__arrow"
                src={ARROW}
              />
            </div>
            {renderedWelcomePage}
          </FullWidthLayout>
        )}
      </AdminRestricted>
    </AdminLayout>
  );
};
