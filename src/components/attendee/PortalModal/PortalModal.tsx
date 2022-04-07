import React, { MouseEventHandler } from "react";
import classNames from "classnames";

import { STRING_DASH_SPACE, STRING_SPACE } from "settings";

import { Room } from "types/rooms";
import { WorldEvent } from "types/venues";

import { eventEndTime, eventStartTime } from "utils/event";
import { formatTimeLocalised } from "utils/time";

import { useSpaceById } from "hooks/spaces/useSpaceById";
import { useRelatedVenues } from "hooks/useRelatedVenues";

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

  const portalSpaceId = portal.spaceId;

  const { findVenueInRelatedVenues } = useRelatedVenues();

  const portalVenue = findVenueInRelatedVenues({ spaceId: portalSpaceId });

  const numberOfUsersInRoom = portalVenue?.recentUserCount ?? 0;

  const popupWrapperClasses = classNames(CN.popupWrapper, {
    [CN.popupWrapperAligned]: !!numberOfUsersInRoom,
  });

  return (
    <div className={popupWrapperClasses}>
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
              <span>{formatTimeLocalised(eventEndTime({ event }))}</span>
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
    </div>
  );
};
