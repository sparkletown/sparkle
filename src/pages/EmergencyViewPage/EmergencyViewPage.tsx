import React, { Suspense, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { NotFound } from "components/shared/NotFound";
import { addDays } from "date-fns";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import { isEventWithinDateAndNotFinished } from "utils/event";
import { range } from "utils/range";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useLiveUser } from "hooks/user/useLiveUser";
import useVenueScheduleEvents from "hooks/useVenueScheduleEvents";

import { Login } from "pages/auth/Login";

import { LoadingPage } from "components/molecules/LoadingPage";

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

  const { user, userWithId } = useLiveUser();
  const userEventIds =
    userWithId?.myPersonalizedSchedule ?? emptyPersonalizedSchedule;

  const {
    dayDifference,
    liveAndFutureEvents,
    firstScheduleDate,
    worldSpaces,
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

        if (!dailyEvents.length) {
          return null;
        }
        return (
          <div
            className="EmergencyView__weekdays-column"
            key={day.getTime()}
          ></div>
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
          <EmergencyViewPagePortals worldSpaces={worldSpaces} />
        ) : (
          <ul className="EmergencyView__weekdays">{weekdays}</ul>
        )}
      </div>
    </div>
  );
};
