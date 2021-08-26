import React, { useMemo } from "react";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import "./NavBarScheduleWeather.scss";

export interface NavBarScheduleWeatherProps extends ContainerClassName {}

type WeatherInfo = {
  temperatureCelsius: number;
  stateOfSky: string;
  windVelocityKph: number;
  windDirection: WeatherWindDirection;
  humidityPercents: number;
};

enum WeatherWindDirection {
  N = "N",
  S = "S",
  E = "E",
  W = "W",
}

export const NavBarScheduleWeather: React.FC<NavBarScheduleWeatherProps> = ({
  containerClassName,
}) => {
  const weather: WeatherInfo = useMemo(
    () => ({
      temperatureCelsius: 11,
      stateOfSky: "Mostly Sunny",
      windVelocityKph: 17,
      windDirection: WeatherWindDirection.N,
      humidityPercents: 43,
    }),
    []
  );

  return (
    <div className={classNames("NavBarScheduleWeather", containerClassName)}>
      <div className="NavBarScheduleWeather__temp-and-state">
        <h3>{`${weather.temperatureCelsius} °C`}</h3>
        <h5 className="NavBarScheduleWeather__state">{weather.stateOfSky}</h5>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: `Humidity <b>${weather.humidityPercents}%</b> — Wind <b>${weather.windVelocityKph} KPH ${weather.windDirection}</b>`,
        }}
      />
      <div>Black Rock Desert, Nevada, USA</div>
    </div>
  );
};
