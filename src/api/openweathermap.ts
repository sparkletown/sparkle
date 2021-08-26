import firebase from "firebase/app";
import { capitalize } from "lodash";

type OpenWeatherApiResponse = {
  main: {
    humidity: number;
    temp: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  weather: {
    description: string;
  }[];
};

export type WeatherInfo = {
  temperatureCelsius: number;
  stateOfSky: string;
  windSpeedKPH: number;
  windDirection: string;
  humidityPercents: number;
};

const fetchBlackRockWeatherDoc = async (): Promise<
  OpenWeatherApiResponse | undefined
> => {
  const firestore = firebase.firestore();
  const docRef = await firestore.collection("weather").doc("blackRock").get();
  return docRef.data() as OpenWeatherApiResponse;
};

const convertWindDegreeToWindDirection = (deg: number) => {
  const windDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

  const degrees = (deg * 8) / 360;
  const direction = (Math.round(degrees) + 8) % 8;
  return windDirections[direction];
};

const convertMpsToKph = (mps: number) => mps * 3.6;

const capitalizeWords = (s: string) => s.split(" ").map(capitalize).join(" ");

export const getBlackRockWeatherInfo = async (): Promise<
  WeatherInfo | undefined
> => {
  const openWeatherApiResponse = await fetchBlackRockWeatherDoc();

  if (!openWeatherApiResponse) return;

  return {
    temperatureCelsius: Math.round(openWeatherApiResponse.main.temp),
    stateOfSky: capitalizeWords(openWeatherApiResponse.weather[0].description),
    windSpeedKPH: Math.round(
      convertMpsToKph(openWeatherApiResponse.wind.speed)
    ),
    windDirection: convertWindDegreeToWindDirection(
      openWeatherApiResponse.wind.deg
    ),
    humidityPercents: openWeatherApiResponse.main.humidity,
  };
};
