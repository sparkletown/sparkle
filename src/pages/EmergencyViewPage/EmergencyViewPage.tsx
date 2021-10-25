import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useCss } from "react-use";
import classNames from "classnames";
import { addDays } from "date-fns";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import { DEFAULT_VENUE_BANNER_COLOR } from "settings";

import {
  eventTimeAndOrderComparator,
  isEventWithinDateAndNotFinished,
} from "utils/event";
import { range } from "utils/range";
import { formatDateRelativeToNow } from "utils/time";

import { useValidImage } from "hooks/useCheckImage";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
import useVenueScheduleEvents from "hooks/useVenueScheduleEvents";

import Login from "pages/Account/Login";
import { updateTheme } from "pages/VenuePage/helpers";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { LoadingPage } from "components/molecules/LoadingPage";
import { ScheduleEventSubListNG } from "components/molecules/ScheduleEventListNG/ScheduleEventSubListNG";

import { NotFound } from "components/atoms/NotFound";

import EmergencyViewPageRooms from "./EmergencyViewPageRooms";
import EmergencyViewTabs from "./EmergencyViewTabs";

import "./EmergencyViewPage.scss";

dayjs.extend(advancedFormat);

export const emptyPersonalizedSchedule = {};

export const EmergencyViewPage: React.FC = () => {
  const [selectedTab, updateTab] = useState(0);
  const venueId = useVenueId() || "";

  const {
    currentVenue: venue,
    isCurrentVenueLoaded,
  } = useConnectCurrentVenueNG(venueId);

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

  const redirectUrl = venue?.config?.redirectUrl ?? "";
  const { hostname } = window.location;

  useEffect(() => {
    if (redirectUrl && redirectUrl !== hostname) {
      window.location.hostname = redirectUrl;
    }
  }, [hostname, redirectUrl]);

  useEffect(() => {
    if (!venue) return;

    // @debt replace this with useCss?
    updateTheme(venue);
  }, [venue]);

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
            <ScheduleEventSubListNG
              events={eventsFilledWithPriority}
              title={`Events on ${formatDateRelativeToNow(day)}`}
              isShowFullInfo={false}
            />
          </div>
        );
      })
      .filter((day) => !!day);
  }, [dayDifference, liveAndFutureEvents, firstScheduleDate]);

  const [validBannerImageUrl] = useValidImage(
    venue?.config?.landingPageConfig.bannerImageUrl,
    DEFAULT_VENUE_BANNER_COLOR
  );

  const containerVars = useCss({
    "background-image": `url("${validBannerImageUrl}")`,
  });

  const containerClasses = classNames("EmergencyView", containerVars);

  if (!venueId || (isCurrentVenueLoaded && !venue)) {
    return (
      <WithNavigationBar>
        <NotFound />
      </WithNavigationBar>
    );
  }

  if (!venue) {
    return <LoadingPage />;
  }

  if (!user) {
    return (
      <Suspense fallback={<LoadingPage />}>
        <Login venueId={venueId} />
      </Suspense>
    );
  }

  return (
    <WithNavigationBar>
      <div className={containerClasses}>
        <EmergencyViewTabs updateTab={updateTab} selectedTab={selectedTab} />
        <div className="EmergencyView__main">
          {!selectedTab ? (
            <EmergencyViewPageRooms
              descendantVenues={descendantVenues}
              liveAndFutureEvents={liveAndFutureEvents}
            />
          ) : (
            <ul className="EmergencyView__weekdays">{weekdays}</ul>
          )}
        </div>
      </div>
    </WithNavigationBar>
  );
};
