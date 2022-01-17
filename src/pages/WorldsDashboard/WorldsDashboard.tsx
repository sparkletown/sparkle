import React, { useMemo } from "react";
import { HeaderButton } from "components/admin/HeaderButton";
import { Section } from "components/admin/Section";
import { SectionHeading } from "components/admin/SectionHeading";
import { SectionTitle } from "components/admin/SectionTitle";
import { WithAuthProps } from "components/hocs/db/withAuth";
import { AdminLayout } from "components/layouts/AdminLayout";
import { FullWidthLayout } from "components/layouts/FullWidthLayout";

import { ADMIN_IA_WORLD_CREATE_URL } from "settings";

import { useOwnWorlds } from "hooks/worlds/useOwnWorlds";

import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminShowcaseTitle } from "components/organisms/AdminVenueView/components/AdminShowcaseTitle";

import { AdminHeader } from "components/atoms/AdminHeader";
import { AdminRestricted } from "components/atoms/AdminRestricted";
import { ButtonNG } from "components/atoms/ButtonNG";

import { WorldsTable } from "./WorldsTable";

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
                  <HeaderButton
                    to={ADMIN_IA_WORLD_CREATE_URL}
                    extraClasses="text-white bg-sparkle rounded-full"
                    name="Create new world"
                    iconExtraClasses=""
                  />
                </SectionHeading>
                <WorldsTable worlds={worlds} />
              </Section>
            </FullWidthLayout>
          </>
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
      </AdminRestricted>
    </AdminLayout>
  );
};
