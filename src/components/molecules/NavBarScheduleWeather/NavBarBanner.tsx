import React from "react";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import { BlackRockDesertImageBackground } from "components/molecules/NavBarScheduleWeather/WeatherBackground";

import SparkleverseBanner from "assets/images/sparkleverse_banner.png";

import "./NavBarBanner.scss";

export const NavBarBanner: React.FC<ContainerClassName> = ({
  containerClassName,
}) => {
  return (
    <>
      {
        <BlackRockDesertImageBackground
          containerClassName={classNames("NavBarBanner", containerClassName)}
        >
          <img
            className="NavBarBanner__banner"
            src={SparkleverseBanner}
            alt="Sparkleverse"
          />
        </BlackRockDesertImageBackground>
      }
    </>
  );
};
