import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";
import "./PlayaTime.scss";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CURRENT_TIME_IN_LOCATION } from "settings";

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

  useEffect(() => {
    const updateTime = () => {
      const pt = dayjs().tz("Australia/Sydney");
      setCurrentTime(pt.format("h:mm a"));
    };
    updateTime();
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="playa_time-container">
      <FontAwesomeIcon icon={faClock} className="playa_time-icon" />{" "}
      {currentTime} in {CURRENT_TIME_IN_LOCATION}
    </div>
  );
};

export default PlayaTime;
