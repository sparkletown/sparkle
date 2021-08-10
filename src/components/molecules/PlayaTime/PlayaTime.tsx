import React, { useState } from "react";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";

import { CURRENT_TIME_IN_LOCATION } from "settings";

import { useInterval } from "hooks/useInterval";

import "./PlayaTime.scss";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  meridiem: (hour: number, minute: number, isLowercase: boolean) => {
    const meridiem = hour > 12 ? "P.M." : "A.M.";
    return isLowercase ? meridiem.toLowerCase() : meridiem;
  },
});

const PlayaTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState("");

  useInterval(() => {
    const pt = dayjs().tz("Australia/Sydney");
    setCurrentTime(pt.format("h:mm a"));
  }, 1000);

  return (
    <div className="playa_time-container">
      <FontAwesomeIcon icon={faClock} className="playa_time-icon" />{" "}
      {currentTime} in {CURRENT_TIME_IN_LOCATION}
    </div>
  );
};

export default PlayaTime;
