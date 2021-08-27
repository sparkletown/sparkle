import React, { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { isEqual } from "lodash";

import { getBlackRockWeatherInfo, WeatherInfo } from "api/openweathermap";

import { ContainerClassName } from "types/utility";

import { useInterval } from "hooks/useInterval";

import { BlackRockWeatherBackground } from "components/molecules/NavBarScheduleWeather/WeatherBackground";

import "./NavBarScheduleWeather.scss";

export interface NavBarScheduleWeatherProps extends ContainerClassName {}

const UPDATE_INTERVAL = 30 * 1000;

export const NavBarScheduleWeather: React.FC<NavBarScheduleWeatherProps> = ({
  containerClassName,
}) => {
  const [weather, setWeather] = useState<WeatherInfo>();
  const fetchWeather = useCallback(async () => {
    const current = await getBlackRockWeatherInfo();
    if (!current) setWeather(undefined);
    setWeather((prev) => (isEqual(prev, current) ? prev : current));
  }, []);

  useEffect(() => {
    void fetchWeather();
  }, [fetchWeather]);
  useInterval(fetchWeather, UPDATE_INTERVAL);

  return (
    <>
      {weather && (
        <BlackRockWeatherBackground
          containerClassName={classNames(
            "NavBarScheduleWeather",
            containerClassName
          )}
        >
          <div className="NavBarScheduleWeather__temp-and-state">
            <h3>{`${weather.temperatureCelsius} °C`}</h3>
            <h5 className="NavBarScheduleWeather__state">
              {weather.stateOfSky}
            </h5>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: `Humidity <b>${weather.humidityPercents}%</b> — Wind <b>${weather.windSpeedKPH} KPH ${weather.windDirection}</b>`,
            }}
          />
          <div>Black Rock Desert, Nevada, USA</div>
        </BlackRockWeatherBackground>
      )}
    </>
  );
};
