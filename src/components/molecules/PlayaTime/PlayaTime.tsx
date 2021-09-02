import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";

import { PLAYA_LOCATION_NAME, PLAYA_TIME_REFRESH_MS } from "settings";

import { useInterval } from "hooks/useInterval";

import { usePlayaTime } from "components/molecules/PlayaTime/usePlayaTime";

import "./PlayaTime.scss";

dayjs.extend(updateLocale);

export const PlayaTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState("");
  const playaTime = usePlayaTime();
  const setPlayaTime = useCallback(() => {
    setCurrentTime(playaTime.format("h:mm A"));
  }, [playaTime]);

  useEffect(setPlayaTime, [setPlayaTime]);
  useInterval(setPlayaTime, PLAYA_TIME_REFRESH_MS);

  return (
    <div className="PlayaTime__container">
      <span className="PlayaTime__time">{currentTime}</span> on the{" "}
      {PLAYA_LOCATION_NAME}
    </div>
  );
};
