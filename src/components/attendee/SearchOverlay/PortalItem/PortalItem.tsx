import { useCallback } from "react";

import { SPACE_TAXON } from "settings";

import { Room } from "types/rooms";

import { isExternalPortal, openUrl } from "utils/url";

import { useCustomSound } from "hooks/sounds";
import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useAnalytics } from "hooks/useAnalytics";
import { usePortal } from "hooks/usePortal";

import CN from "./PortalItem.module.scss";

export type PortalItemProps = {
  portal: Room;
  onClick: () => void;
};

export const PortalItem: React.FC<PortalItemProps> = ({ portal, onClick }) => {
  const { space } = useWorldAndSpaceByParams();

  const { enterPortal } = usePortal({
    portal,
  });

  const [enterWithSound] = useCustomSound(portal.enterSound, {
    interrupt: true,
    onend: enterPortal,
  });

  const analytics = useAnalytics({ venue: space });

  const enter = useCallback(() => {
    analytics.trackEnterRoomEvent(portal.title, portal.template);
    void (isExternalPortal(portal) ? openUrl(portal.url) : enterWithSound());
    onClick();
  }, [analytics, enterWithSound, portal, onClick]);

  return (
    <div>
      <div className={CN.portalItemResultHeader} onClick={enter}>
        <h3 className={CN.portalItemResultTitle}>
          {portal.title}
          <span>{SPACE_TAXON.title}</span>
        </h3>
      </div>
      <p className={CN.portalItemResultSubtitle}>{portal.subtitle}</p>
    </div>
  );
};
