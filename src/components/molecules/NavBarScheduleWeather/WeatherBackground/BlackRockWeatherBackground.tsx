import React, { PropsWithChildren, useState } from "react";
import useInterval from "react-use/lib/useInterval";
import classNames from "classnames";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { ContainerClassName } from "types/utility";

import "./WeatherBackground.scss";

dayjs.extend(utc);
dayjs.extend(timezone);

const PART_OF_DAY = ["night", "morning", "day", "evening"];
const PART_OF_DAY_LENGTH = 24 / PART_OF_DAY.length;
const IMAGES_PER_PART_OF_DAY = 3;

const IMAGE_UPDATE_INTERVAL = 60 * 1000;

const getCurrentImageName = () => {
  //timezone of Black Rock Desert
  const time = dayjs().tz("America/Los_Angeles");
  const hour = time.hour();
  console.log("hour", hour);

  const partOfDayIndex = Math.floor(hour / PART_OF_DAY_LENGTH);
  const partOfDaySubIndex =
    Math.floor(
      (partOfDayIndex % PART_OF_DAY_LENGTH) /
        (PART_OF_DAY_LENGTH / IMAGES_PER_PART_OF_DAY)
    ) + 1;

  return `${PART_OF_DAY[partOfDayIndex]}${partOfDaySubIndex}`;
};

export const BlackRockWeatherBackground: React.FC<
  PropsWithChildren<ContainerClassName>
> = ({ children, containerClassName }) => {
  const [imageName, setImageName] = useState(getCurrentImageName());
  console.log("imageName", imageName);

  useInterval(() => {
    setImageName(getCurrentImageName());
  }, IMAGE_UPDATE_INTERVAL);

  return (
    <div
      className={classNames(
        `WeatherBackground--${imageName}`,
        containerClassName
      )}
    >
      {children}
    </div>
  );
};
