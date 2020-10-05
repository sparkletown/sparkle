import React, { useState, useEffect, FC } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "./PlayaBackground.scss";
import { PLAYA_BG_DAYPART_MS, PLAYA_IMAGE, PLAYA_VENUE_NAME } from "settings";
dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  backgroundImage: string | undefined;
  nightCycle?: boolean;
}

export const PlayaBackground: FC<Props> = ({ backgroundImage, nightCycle }) => {
  const [daypartClassName, setDaypartClassName] = useState("");

  useEffect(() => {
    const updateStats = () => {
      const pt = dayjs().tz("America/Los_Angeles");
      const ptHour = pt.hour();

      if (ptHour >= 5 && ptHour < 9) {
        setDaypartClassName("daypart-morning");
      }
      if (ptHour >= 9 && ptHour < 18) {
        setDaypartClassName("daypart-day");
      }
      if (ptHour >= 18 && ptHour < 21) {
        setDaypartClassName("daypart-evening");
      }
      if (ptHour >= 21 || ptHour < 5) {
        setDaypartClassName("daypart-night");
      }
    };
    updateStats();
    const id = setInterval(updateStats, PLAYA_BG_DAYPART_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <img
      className={`playa-background ${
        nightCycle ? daypartClassName : "daypart-day"
      }`}
      src={backgroundImage ?? PLAYA_IMAGE}
      alt={`${PLAYA_VENUE_NAME} Background Map`}
    />
  );
};

PlayaBackground.defaultProps = {
  nightCycle: true,
};
