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

import {
  ADMIN_IA_SPACE_CREATE_PARAM_URL,
  ALWAYS_EMPTY_ARRAY,
  SPACE_TAXON,
} from "settings";

import { isNotPartyMapVenue, isPartyMapVenue } from "types/venues";

import { generateUrl } from "utils/url";

import { useSpacesByWorldId } from "hooks/spaces/useSpacesByWorldId";
import { useUserId } from "hooks/user/useUserId";
import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";
import { useWorldParams } from "hooks/worlds/useWorldParams";

import { LoadingPage } from "components/molecules/LoadingPage";

export const SpacesDashboard: React.FC = () => {
  const urlParams = useWorldParams();
  const {
    world,
    worldId,
    worldSlug,
    isLoading: isWorldLoading,
  } = useWorldBySlug(urlParams);
  const { userId, isLoading: isUserLoading } = useUserId();

  const isWorldAdmin = userId ? world?.owners.includes(userId) : undefined;
  const { spaces } = useSpacesByWorldId({ worldId });

  const renderedMapCards = useMemo(
    () =>
      world
        ? spaces?.filter(isPartyMapVenue).map((space) => {
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
          })
        : ALWAYS_EMPTY_ARRAY,
    [spaces, userId, world, isWorldAdmin]
  );

  const renderedOtherSpacesCards = useMemo(
    () =>
      world
        ? spaces?.filter(isNotPartyMapVenue).map((space) => {
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
          })
        : ALWAYS_EMPTY_ARRAY,
    [spaces, userId, world, isWorldAdmin]
  );

  const hasSpaces = spaces?.length > 0;
  const hasMaps = renderedMapCards.length > 0;
  const hasOtherSpaces = renderedOtherSpacesCards.length > 0;

  const createNewSpaceUrl = generateUrl({
    route: ADMIN_IA_SPACE_CREATE_PARAM_URL,
    required: ["worldSlug"],
    params: { worldSlug },
  });

  if (isWorldLoading || isUserLoading) {
    return <LoadingPage />;
  }

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
