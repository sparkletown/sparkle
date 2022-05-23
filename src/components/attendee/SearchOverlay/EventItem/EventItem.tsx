import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "components/attendee/Button";
import { NavOverlayTabType } from "components/attendee/NavOverlay/NavOverlay";
import { differenceInCalendarDays, isToday } from "date-fns";

import { SPACE_TAXON, STRING_DASH_SPACE, STRING_SPACE } from "settings";

import { ScheduledEvent } from "types/venues";

import { eventEndTime, eventStartTime } from "utils/event";
import {
  formatDateRelativeToNow,
  formatTimeLocalised,
  getDateDayMonth,
} from "utils/time";
import { enterSpace } from "utils/url";

import { useSpaceById } from "hooks/spaces/useSpaceById";
import { useWorldById } from "hooks/worlds/useWorldById";

import CN from "../SearchOverlay.module.scss";

export type EventItemProps = {
  event: ScheduledEvent;
  onClick: () => void;
  setNavMenu: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const EventItem: React.FC<EventItemProps> = ({
  event,
  onClick,
  setNavMenu,
}) => {
  const { space } = useSpaceById({ spaceId: event.spaceId });
  const { world } = useWorldById({ worldId: event.worldId });

  const { push: openUrlUsingRouter } = useHistory();

  const handleEnterSpace = useCallback(() => {
    enterSpace(world?.slug, space?.slug, {
      customOpenRelativeUrl: openUrlUsingRouter,
    });
    onClick();
  }, [world?.slug, openUrlUsingRouter, onClick, space?.slug]);

  const showDate =
    Boolean(
      differenceInCalendarDays(
        eventEndTime({ event }),
        eventStartTime({ event })
      )
    ) || !isToday(eventStartTime({ event }));

  const handleEnterSchedule = () => {
    setNavMenu(NavOverlayTabType.schedule);
  };

  return (
    <div>
      <div className={CN.searchItemResultHeader}>
        <h3 className={CN.searchItemResultTitle}>
          {event.name}
          <span>Experience</span>
        </h3>
      </div>
      <div className={CN.searchItemResultSubtitle}>
        <span>
          {formatTimeLocalised(eventStartTime({ event })) + STRING_DASH_SPACE}
        </span>
        <span>
          {showDate && formatDateRelativeToNow(eventEndTime({ event }))}
        </span>
        {STRING_SPACE}
        <span>{formatTimeLocalised(eventEndTime({ event }))}</span>
        <span> in {space?.name}</span>
      </div>
      <p className={CN.searchItemResultSubtitle}>{event.description}</p>
      <div className={CN.actionContainer}>
        <Button
          variant="alternative"
          border="alternative"
          onClick={handleEnterSpace}
          marginless
        >
          Go to {SPACE_TAXON.lower}
        </Button>
        <Button
          variant="alternative"
          border="alternative"
          onClick={handleEnterSchedule}
        >
          See all experiences on {getDateDayMonth(eventStartTime({ event }))}
        </Button>
      </div>
    </div>
  );
};
