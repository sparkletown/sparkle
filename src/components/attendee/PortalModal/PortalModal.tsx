import React, { MouseEventHandler } from "react";

import { STRING_DASH_SPACE } from "settings";

import { Room } from "types/rooms";
import { WorldEvent } from "types/venues";

import { eventEndTime, eventStartTime } from "utils/event";
import { formatTimeLocalised } from "utils/time";

import { useSpaceById } from "hooks/spaces/useSpaceById";

import { Button } from "../Button";

import CN from "./PortalModal.module.scss";

interface PortalModalProps {
  onEnter?: MouseEventHandler<HTMLButtonElement>;
  portal: Room;
  event?: WorldEvent;
}

export const PortalModal: React.FC<PortalModalProps> = ({
  onEnter,
  portal,
  event,
}) => {
  const { space } = useSpaceById({ spaceId: portal.spaceId });

  return (
    <div className={CN.popupWrapper}>
      <div className={CN.PortalPopupInfo}>
        {event ? (
          <>
            <h3>{event?.name}</h3>
            <p>{event?.host}</p>
            <p>
              <span>
                {formatTimeLocalised(eventStartTime({ event })) +
                  STRING_DASH_SPACE}
              </span>
              <span>{formatTimeLocalised(eventEndTime({ event }))}</span>
            </p>
            <p>{event?.description}</p>
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
    </div>
  );
};
