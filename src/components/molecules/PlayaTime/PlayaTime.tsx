import React, { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";

import { CURRENT_TIME_IN_LOCATION, CURRENT_TIMEZONE } from "settings";

import { useInterval } from "hooks/useInterval";

import "./PlayaTime.scss";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(updateLocale);

const PlayaTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState("");

  useInterval(() => {
    const pt = dayjs().tz(CURRENT_TIMEZONE);
    setCurrentTime(pt.format("h:mm A"));
  }, 1000);

  return (
    <div className="PlayaTime__container">
      <span className="PlayaTime__time">{currentTime}</span> on the{" "}
      {CURRENT_TIME_IN_LOCATION}
    </div>
  );
};

export default PlayaTime;
