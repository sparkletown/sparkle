import React, { PropsWithChildren, useCallback, useState } from "react";
import useInterval from "react-use/lib/useInterval";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import { usePlayaTime } from "components/molecules/PlayaTime/usePlayaTime";

import "components/molecules/NavBarScheduleWeather/WeatherBackground/BlackRockDesertImageBackground.scss";

const PART_OF_DAY = ["night", "morning", "day", "evening"];
const PART_OF_DAY_LENGTH = 24 / PART_OF_DAY.length;
const IMAGES_PER_PART_OF_DAY = 3;

const IMAGE_UPDATE_INTERVAL = 60 * 1000;

const getCurrentImageName = (playaTimeHour: number) => {
  const partOfDayIndex = Math.floor(playaTimeHour / PART_OF_DAY_LENGTH);
  const partOfDaySubIndex =
    Math.floor(
      (playaTimeHour % PART_OF_DAY_LENGTH) /
        (PART_OF_DAY_LENGTH / IMAGES_PER_PART_OF_DAY)
    ) + 1;

  return `${PART_OF_DAY[partOfDayIndex]}${partOfDaySubIndex}`;
};

export const BlackRockDesertImageBackground: React.FC<
  PropsWithChildren<ContainerClassName>
> = ({ children, containerClassName }) => {
  const playaTime = usePlayaTime();
  const setCurrentImage = useCallback(() => {
    setImageName(getCurrentImageName(playaTime.hour()));
  }, [playaTime]);

  const [imageName, setImageName] = useState(
    getCurrentImageName(playaTime.hour())
  );

  useInterval(setCurrentImage, IMAGE_UPDATE_INTERVAL);

  return (
    <div
      className={classNames(
        `BlackRockDesertImageBackground--${imageName}`,
        containerClassName
      )}
    >
      {children}
    </div>
  );
};
