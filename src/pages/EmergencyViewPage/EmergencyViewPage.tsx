import React, { Suspense, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { NotFound } from "components/shared/NotFound";
import { addDays } from "date-fns";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import {
  eventTimeAndOrderComparator,
  isEventWithinDateAndNotFinished,
} from "utils/event";
import { range } from "utils/range";
import { formatDateRelativeToNow } from "utils/time";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useUser } from "hooks/useUser";
import useVenueScheduleEvents from "hooks/useVenueScheduleEvents";

import { Login } from "pages/auth/Login";

import { LoadingPage } from "components/molecules/LoadingPage";
import { ScheduleEventSubList } from "components/molecules/ScheduleEventList/ScheduleEventSubList";

import { EmergencyViewPagePortals } from "./EmergencyViewPagePortals";
import EmergencyViewTabs from "./EmergencyViewTabs";

import "./EmergencyViewPage.scss";

dayjs.extend(advancedFormat);

const emptyPersonalizedSchedule = {};

export const EmergencyViewPage: React.FC = () => {
  const [selectedTab, updateTab] = useState(0);

  const {
    space,
    spaceId,
    isLoaded: isCurrentVenueLoaded,
  } = useWorldAndSpaceByParams();

  const { user, userWithId } = useUser();
  const userEventIds =
    userWithId?.myPersonalizedSchedule ?? emptyPersonalizedSchedule;

  const {
    descendantVenues,
    dayDifference,
    liveAndFutureEvents,
    firstScheduleDate,
  } = useVenueScheduleEvents({
    userEventIds,
  });

  const redirectUrl = space?.config?.redirectUrl ?? "";
  const { hostname } = window.location;

  useEffect(() => {
    if (redirectUrl && redirectUrl !== hostname) {
      window.location.hostname = redirectUrl;
    }
  }, [hostname, redirectUrl]);

  const weekdays = useMemo(() => {
    return range(dayDifference)
      .map((dayIndex) => {
        const day = addDays(firstScheduleDate, dayIndex);

        const dailyEvents = liveAndFutureEvents.filter(
          isEventWithinDateAndNotFinished(day)
        );

        const eventsFilledWithPriority = dailyEvents.sort(
          eventTimeAndOrderComparator
        );

        if (!dailyEvents.length) {
          return null;
        }
        return (
          <div className="EmergencyView__weekdays-column" key={day.getTime()}>
            <ScheduleEventSubList
              events={eventsFilledWithPriority}
              title={`Events on ${formatDateRelativeToNow(day)}`}
              isShowFullInfo={false}
            />
          </div>
        );
      })
      .filter((day) => !!day);
  }, [dayDifference, liveAndFutureEvents, firstScheduleDate]);

  const containerClasses = classNames("EmergencyView");

  if (!spaceId || (isCurrentVenueLoaded && !space)) {
    return <NotFound />;
  }

  if (!space) {
    return <LoadingPage />;
  }

  if (!user) {
    return (
      <Suspense fallback={<LoadingPage />}>
        <Login />
      </Suspense>
    );
  }

  return (
    <div className={containerClasses}>
      <EmergencyViewTabs updateTab={updateTab} selectedTab={selectedTab} />
      <div className="EmergencyView__main">
        {!selectedTab ? (
          <EmergencyViewPagePortals descendantVenues={descendantVenues} />
        ) : (
          <ul className="EmergencyView__weekdays">{weekdays}</ul>
        )}
      </div>
    </div>
  );
};
