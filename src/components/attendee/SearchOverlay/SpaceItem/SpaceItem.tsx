import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "components/attendee/Button";

import { SPACE_TAXON } from "settings";

import { SpaceWithId } from "types/id";

import { enterSpace } from "utils/url";

import { useWorldById } from "hooks/worlds/useWorldById";

import CN from "../SearchOverlay.module.scss";

export type SpaceItemProps = {
  space: SpaceWithId;
  onClick: () => void;
};

export const SpaceItem: React.FC<SpaceItemProps> = ({ space, onClick }) => {
  const { world } = useWorldById({ worldId: space.worldId });

  const { push: openUrlUsingRouter } = useHistory();

  const handleEnterSpace = useCallback(() => {
    enterSpace(world?.slug, space?.slug, {
      customOpenRelativeUrl: openUrlUsingRouter,
    });
    onClick();
  }, [world?.slug, openUrlUsingRouter, onClick, space?.slug]);

  const { subtitle, description } = space?.config?.landingPageConfig ?? {};

  return (
    <div data-bem="SpaceItem">
      <div className={CN.searchItemResultHeader}>
        <h3 className={CN.searchItemResultTitle}>
          {space.name}
          <span>{SPACE_TAXON.title}</span>
        </h3>
      </div>
      {subtitle && <p className={CN.searchItemResultSubtitle}>{subtitle}</p>}
      {description && (
        <p className={CN.searchItemResultSubtitle}>{description}</p>
      )}
      <Button
        onClick={handleEnterSpace}
        variant="alternative"
        border="alternative"
        marginless
      >
        Go to {SPACE_TAXON.lower}
      </Button>
    </div>
  );
};
