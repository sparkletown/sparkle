import { useCallback } from "react";

import { SPACE_TAXON } from "settings";

import { Room } from "types/rooms";

import { isExternalPortal, openUrl } from "utils/url";

import { useCustomSound } from "hooks/sounds";
import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useAnalytics } from "hooks/useAnalytics";
import { usePortal } from "hooks/usePortal";

import styles from "../SearchOverlay.module.scss";
type PortalItemProps = {
  portal: Room;
  onClick: () => void;
};
export const PortalItem: React.FC<PortalItemProps> = ({ portal, onClick }) => {
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { space } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);

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
    <div className={styles.SearchOverlay__result_item}>
      <div className={styles.SearchOverlay__result_header} onClick={enter}>
        <h3>
          {portal.title}
          <span>{SPACE_TAXON.title}</span>
        </h3>
      </div>
      <p className={styles.SearchOverlay__result_subtitle}>{portal.subtitle}</p>
    </div>
  );
};
