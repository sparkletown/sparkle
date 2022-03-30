import React from "react";
import { useHistory } from "react-router-dom";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "components/admin/Button";
import { EventsPanel } from "components/admin/EventsPanel";

import { ADMIN_IA_WORLD_SCHEDULE, STRING_NON_BREAKING_SPACE } from "settings";

import { SpaceWithId, WorldId } from "types/id";

import { convertDateFromUtcSeconds, formatDate } from "utils/time";
import { generateUrl } from "utils/url";

import { useShowHide } from "hooks/useShowHide";
import { useWorldParams } from "hooks/worlds/useWorldParams";

import { TimingEventModal } from "components/organisms/TimingEventModal";

import * as TW from "./SpaceSchedule.tailwind";

interface SpaceScheduleProps {
  globalStartTime: number | undefined;
  globalEndTime: number | undefined;
  space: SpaceWithId;
}

export const SpaceSchedule: React.FC<SpaceScheduleProps> = ({
  globalStartTime,
  globalEndTime,
  space,
}) => {
  const history = useHistory();
  const { worldSlug } = useWorldParams();

  const {
    isShown: isShownCreateEventModal,
    show: showCreateEventModal,
    hide: hideCreateEventModal,
  } = useShowHide();

  const {
    inputFormattedDateSegment: startDate,
    inputFormattedTimeSegment: startTime,
  } = convertDateFromUtcSeconds(globalStartTime ?? 0);

  const {
    inputFormattedDateSegment: endDate,
    inputFormattedTimeSegment: endTime,
  } = convertDateFromUtcSeconds(globalEndTime ?? 0);

  const navigateToWorldSchedule = () => {
    const worldScheduleUrl = generateUrl({
      route: ADMIN_IA_WORLD_SCHEDULE,
      required: ["worldSlug"],
      params: {
        worldSlug,
      },
    });

    history.push(worldScheduleUrl);
  };

  return (
    <div className={TW.container}>
      <div className={TW.worldSchedulePanel}>
        <div className={TW.worldScheduleSection}>
          <div className={TW.worldScheduleTitle}>
            Global start date and time
          </div>
          <div className={TW.worldScheduleDateTime}>
            <div className={TW.worldScheduleDate}>{`${formatDate(
              new Date(startDate)
            )},`}</div>
            {STRING_NON_BREAKING_SPACE + startTime}
          </div>
        </div>
        <div className={TW.worldScheduleSection}>
          <div className={TW.worldScheduleTitle}>Global end date and time</div>
          <div className={TW.worldScheduleDateTime}>
            <div className={TW.worldScheduleDate}>{`${formatDate(
              new Date(endDate)
            )},`}</div>
            {STRING_NON_BREAKING_SPACE + endTime}
          </div>
        </div>
        <div
          className={TW.worldScheduleButton}
          onClick={navigateToWorldSchedule}
        >
          <FontAwesomeIcon
            icon={faPen}
            className={TW.worldScheduleButtonIcon}
            size="lg"
          />

          <div className={TW.worldScheduleButtonText}>
            Edit in World schedule
          </div>
        </div>
      </div>

      <div className={TW.eventsPanel}>
        <div className={TW.createEventButtonWrapper}>
          <Button onClick={showCreateEventModal}>Create new experience</Button>
        </div>
        <EventsPanel worldId={space.worldId as WorldId} spaces={[space]} />
        {isShownCreateEventModal && (
          <TimingEventModal
            venue={space}
            show={isShownCreateEventModal}
            onHide={hideCreateEventModal}
            worldId={space.worldId}
          />
        )}
      </div>
    </div>
  );
};
