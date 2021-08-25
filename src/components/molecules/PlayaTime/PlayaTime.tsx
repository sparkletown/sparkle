import React, { useState } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";

import {
  CURRENT_TIME_IN_LOCATION,
  CURRENT_TIMEZONE,
  ONE_MINUTE_MS,
} from "settings";

import { useInterval } from "hooks/useInterval";

import "./PlayaTime.scss";

// @debt deprecated dayjs library, use date-fns instead
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(updateLocale);

export const PlayaTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState("");

  useInterval(() => {
    const pt = dayjs().tz(CURRENT_TIMEZONE);
    setCurrentTime(pt.format("h:mm A"));
  }, ONE_MINUTE_MS);

  return (
    <div className="PlayaTime__container">
      <span className="PlayaTime__time">{currentTime}</span> on the{" "}
      {CURRENT_TIME_IN_LOCATION}
    </div>
  );
};
