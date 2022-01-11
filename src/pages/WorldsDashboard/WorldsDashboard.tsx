import React, { useMemo } from "react";
import { WithAuthProps } from "components/hocs/db/withAuth";
import { AdminLayout } from "components/layouts/AdminLayout";

import { ADMIN_IA_WORLD_CREATE_URL } from "settings";

import { useOwnWorlds } from "hooks/worlds/useOwnWorlds";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminShowcaseTitle } from "components/organisms/AdminVenueView/components/AdminShowcaseTitle";

import { WorldCard } from "components/molecules/WorldCard";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { ButtonNG } from "components/atoms/ButtonNG";

import ARROW from "assets/images/admin/dashboard-arrow.svg";

import "./WorldsDashboard.scss";

type Props = WithAuthProps;

export const WorldsDashboard: React.FC<Props> = ({ userId }) => {
  const worlds = useOwnWorlds(userId);

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

  const renderedWorldsList = useMemo(
    () => (
      <div className="WorldsDashboard__worlds-list">
        {worlds.map((world) => (
          <WorldCard key={world.id} world={world} />
        ))}
      </div>
    ),
    [worlds]
  );

  return (
    <div className="WorldsDashboard">
      <AdminLayout>
        <AdminRestricted>
          <AdminPanel variant="unbound">
            {hasWorlds ? (
              <AdminShowcase>
                {/* @debt: possibly add <AdminTitleBar to wrap header content */}
                <AdminShowcaseTitle>Switch World</AdminShowcaseTitle>
                <div className="WorldsDashboard__header">
                  <span className="WorldsDashboard__header-text">
                    My worlds
                  </span>
                  <ButtonNG
                    variant="normal-gradient"
                    linkTo={ADMIN_IA_WORLD_CREATE_URL}
                    className="WorldsDashboard__header-button"
                  >
                    Create new world
                  </ButtonNG>
                </div>
                {renderedWorldsList}
              </AdminShowcase>
            ) : (
              <AdminShowcase>
                <div className="WorldsDashboard__arrow-header">
                  <ButtonNG
                    variant="normal-gradient"
                    linkTo={ADMIN_IA_WORLD_CREATE_URL}
                  >
                    Create new world
                  </ButtonNG>
                  <img
                    alt="arrow pointing towards the Create a world button"
                    className="WorldsDashboard__arrow"
                    src={ARROW}
                  />
                </div>
                {renderedWelcomePage}
              </AdminShowcase>
            )}
          </AdminPanel>
        </AdminRestricted>
      </AdminLayout>
    </div>
  );
};
