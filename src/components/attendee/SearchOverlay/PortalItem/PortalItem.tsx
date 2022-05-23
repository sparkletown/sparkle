import { useCallback } from "react";
import { Button } from "components/attendee/Button";

import { SPACE_TAXON } from "settings";

import { Room } from "types/rooms";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useAnalytics } from "hooks/useAnalytics";
import { usePortal } from "hooks/usePortal";

import CN from "../SearchOverlay.module.scss";

export type PortalItemProps = {
  portal: Room;
  onClick: () => void;
};

export const PortalItem: React.FC<PortalItemProps> = ({ portal, onClick }) => {
  const { space } = useWorldAndSpaceByParams();

  const { enterPortal } = usePortal({
    portal,
  });

  const analytics = useAnalytics({ venue: space });

  const enter = useCallback(() => {
    analytics.trackEnterRoomEvent(portal.title, portal.template);
    void enterPortal();
    onClick();
  }, [analytics, enterPortal, portal, onClick]);

  return (
    <div>
      <div className={CN.searchItemResultHeader}>
        <h3 className={CN.searchItemResultTitle}>
          {portal.title}
          <span>{SPACE_TAXON.title}</span>
        </h3>
      </div>
      <p className={CN.searchItemResultSubtitle}>{portal.subtitle}</p>
      <Button
        onClick={enter}
        variant="alternative"
        border="alternative"
        marginless
      >
        Go to {SPACE_TAXON.lower}
      </Button>
    </div>
  );
};
