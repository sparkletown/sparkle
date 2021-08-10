import React, { useState } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { PLAYA_BG_DAYPART_MS, PLAYA_IMAGE, PLAYA_VENUE_NAME } from "settings";

import { useInterval } from "hooks/useInterval";

import "./PlayaBackground.scss";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  backgroundImage: string | undefined;
  nightCycle?: boolean;
}

export const PlayaBackground: React.FC<Props> = ({
  backgroundImage,
  nightCycle,
}) => {
  const [daypartClassName, setDaypartClassName] = useState("");

  useInterval(() => {
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
  }, PLAYA_BG_DAYPART_MS);

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
