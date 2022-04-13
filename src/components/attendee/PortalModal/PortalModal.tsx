import React, { MouseEventHandler } from "react";
import { Button } from "components/attendee/Button";
import { Popover } from "components/attendee/Popover";

import { SCSS_SPACE_EMPTY, STRING_DASH_SPACE, STRING_SPACE } from "settings";

import { Room } from "types/rooms";
import { WorldEvent } from "types/venues";

import { eventEndTime, eventStartTime } from "utils/event";
import { formatTimeLocalised } from "utils/time";

import { useSpaceById } from "hooks/spaces/useSpaceById";

import CN from "./PortalModal.module.scss";

interface PortalModalProps {
  onEnter?: MouseEventHandler<HTMLButtonElement>;
  portal: Room;
  event?: WorldEvent;
  portalRef: HTMLDivElement | null;
}

export const PortalModal: React.FC<PortalModalProps> = ({
  onEnter,
  portal,
  event,
  portalRef,
}) => {
  const { space } = useSpaceById({ spaceId: portal.spaceId });
  const popOverOffset = event
    ? [0, SCSS_SPACE_EMPTY]
    : [-(SCSS_SPACE_EMPTY * 5), SCSS_SPACE_EMPTY];

  return (
    <Popover referenceElement={portalRef} offset={popOverOffset}>
      <div className={CN.PortalPopupInfo}>
        {event ? (
          <>
            <h3>{event?.name}</h3>
            <div className={CN.portalEventContent}>{event?.host}</div>
            <div className={CN.portalEventContent}>
              <span>
                {formatTimeLocalised(eventStartTime({ event })) +
                  STRING_DASH_SPACE}
              </span>
              {STRING_SPACE}
              <span>
                {STRING_SPACE + formatTimeLocalised(eventEndTime({ event }))}
              </span>
            </div>
            <div className={CN.portalEventContent}>{event?.description}</div>
          </>
        ) : (
          <>
            <h3>{space?.name}</h3>
            <p>{space?.config?.landingPageConfig.description}</p>
          </>
        )}
        <Button variant="primary" onClick={onEnter} marginless>
          Enter
        </Button>
      </div>
    </Popover>
  );
};
