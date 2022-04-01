import React, { useMemo } from "react";
import { AdminRestrictedLoading } from "components/admin/AdminRestrictedLoading";
import { AdminRestrictedMessage } from "components/admin/AdminRestrictedMessage";
import { CardList } from "components/admin/CardList";
import { Header } from "components/admin/Header";
import { HeaderButton } from "components/admin/HeaderButton";
import { Section } from "components/admin/Section";
import { SectionSubtitle } from "components/admin/SectionSubtitle";
import { SpaceCard } from "components/admin/SpaceCard";
import { AdminLayout } from "components/layouts/AdminLayout";
import { FullWidthLayout } from "components/layouts/FullWidthLayout";
import { WithPermission } from "components/shared/WithPermission";

import { ADMIN_IA_SPACE_CREATE_PARAM_URL, SPACE_TAXON } from "settings";

import { UserId, WorldWithId } from "types/id";
import { isNotPartyMapVenue, isPartyMapVenue } from "types/venues";

import { generateUrl } from "utils/url";

import { useWorldSpaces } from "hooks/spaces/useWorldSpaces";

interface SpacesDashboardProps {
  userId: UserId;
  world: WorldWithId;
}

export const SpacesDashboard: React.FC<SpacesDashboardProps> = ({
  userId,
  world,
}) => {
  const isWorldAdmin = userId ? world?.owners.includes(userId) : undefined;
  const { spaces } = useWorldSpaces({ worldId: world.id });

  const renderedMapCards: JSX.Element[] | undefined = useMemo(
    () =>
      spaces?.filter(isPartyMapVenue).map((space) => {
        const isSpaceAdmin = userId
          ? space.owners?.includes(userId)
          : undefined;

        return (
          <SpaceCard
            key={space.id}
            space={space}
            world={world}
            isEditable={isWorldAdmin || isSpaceAdmin}
          />
        );
      }),
    [spaces, userId, world, isWorldAdmin]
  );

  const renderedOtherSpacesCards: JSX.Element[] | undefined = useMemo(
    () =>
      spaces?.filter(isNotPartyMapVenue).map((space) => {
        const isSpaceAdmin = userId
          ? space.owners?.includes(userId)
          : undefined;

        return (
          <SpaceCard
            key={space.id}
            space={space}
            world={world}
            isEditable={isWorldAdmin || isSpaceAdmin}
          />
        );
      }),
    [spaces, userId, world, isWorldAdmin]
  );

  const hasSpaces = spaces?.length > 0;
  const hasMaps = renderedMapCards?.length > 0;
  const hasOtherSpaces = renderedOtherSpacesCards?.length > 0;

  const createNewSpaceUrl = generateUrl({
    route: ADMIN_IA_SPACE_CREATE_PARAM_URL,
    required: ["worldSlug"],
    params: { worldSlug: world.slug },
  });

  return (
    <AdminLayout>
      <WithPermission
        check="world"
        loading={<AdminRestrictedLoading />}
        fallback={<AdminRestrictedMessage />}
      >
        <div className="SpacesDashboard">
          <Header title="Spaces">
            <HeaderButton
              to={createNewSpaceUrl}
              name="Create new space"
              variant="multicolor"
            />
          </Header>
          <FullWidthLayout>
            {!hasSpaces && (
              <div className="SpacesDashboard__welcome-message">
                <p>Welcome!</p>
                <p>Create your first Sparkle {SPACE_TAXON.lower}</p>
              </div>
            )}

            {hasMaps && (
              <Section>
                <SectionSubtitle>Maps</SectionSubtitle>
                <CardList>{renderedMapCards}</CardList>
              </Section>
            )}

            {hasOtherSpaces && (
              <Section>
                <SectionSubtitle>Other spaces</SectionSubtitle>
                <CardList>{renderedOtherSpacesCards}</CardList>
              </Section>
            )}
          </FullWidthLayout>
        </div>
      </WithPermission>
    </AdminLayout>
  );
};
