import React, { MouseEventHandler, RefObject } from "react";
import { useCss } from "react-use";
import classNames from "classnames";
import { Button } from "components/attendee/Button";
import { EventInfo } from "components/attendee/EventInfo";
import { SpaceInfoText } from "components/attendee/SpaceInfoText";

import { COVERT_ROOM_TYPES, SCSS_SPACE_PORTAL_EVENT_WIDTH } from "settings";

import { PortalWithBounds, RoomType } from "types/rooms";
import { RoomVisibility } from "types/RoomVisibility";
import { WorldEvent } from "types/venues";

import { useSpaceById } from "hooks/spaces/useSpaceById";

import CN from "./PortalModal.module.scss";

interface PortalModalProps {
  onEnter?: MouseEventHandler<HTMLButtonElement>;
  portal: PortalWithBounds;
  event?: WorldEvent;
  portalRef: RefObject<HTMLDivElement> | null;
}

const topOffset = 66;
const leftOffsetDivider = 2;

export const PortalModal: React.FC<PortalModalProps> = ({
  onEnter,
  portal,
  event,
  portalRef,
}) => {
  const { space } = useSpaceById({ spaceId: portal.spaceId });
  const top =
    portal.bounds.top + (portal.bounds.height * portal.y_percent) / 100;
  const height = (portal.bounds.height * portal.height_percent) / 100;

  const { width = 0, left = 0 } =
    portalRef?.current?.getBoundingClientRect() ?? {};

  const popoverStyle = useCss({
    top: `${top + (height + topOffset)}px`,
    left: `${
      left - (SCSS_SPACE_PORTAL_EVENT_WIDTH - width) / leftOffsetDivider
    }px`,
  });

  if (!top || !left) {
    return null;
  }

  const isUnclickable =
    portal.visibility === RoomVisibility.unclickable ||
    portal.type === RoomType.unclickable;
  const isCovertRoom = portal.type && COVERT_ROOM_TYPES.includes(portal.type);
  const shouldBeClickable = !isCovertRoom && !isUnclickable;

  const wrapperClasses = classNames(CN.modalWrapper, popoverStyle);

  return (
    <div className={wrapperClasses}>
      <div className={CN.PortalPopupInfo}>
        {event ? (
          <EventInfo event={event} centered />
        ) : (
          space && <SpaceInfoText space={space} variant="desktopPortal" />
        )}

        {shouldBeClickable && (
          <Button variant="primary" onClick={onEnter} marginless>
            Enter
          </Button>
        )}
      </div>
    </div>
  );
};
