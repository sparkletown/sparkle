import firebase from "firebase/app";

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
  temperatureFahrenheit: number;
  stateOfSky: string;
  windSpeedMPH: number;
  windDirection: string;
  humidityPercents: number;
};

const fetchBlackRockWeatherDoc = async (): Promise<
  OpenWeatherApiResponse | undefined
> => {
  try {
    const firestore = firebase.firestore();
    const docRef = await firestore.collection("weather").doc("blackRock").get();
    return docRef.data() as OpenWeatherApiResponse;
  } catch {
    return undefined;
  }
};

const convertWindDegreeToWindDirection = (deg: number) => {
  const windDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

  const degrees = (deg * 8) / 360;
  const direction = (Math.round(degrees) + 8) % 8;
  return windDirections[direction];
};

export const getBlackRockWeatherInfo = async (): Promise<
  WeatherInfo | undefined
> => {
  const openWeatherApiResponse = await fetchBlackRockWeatherDoc();

  if (!openWeatherApiResponse) return;

  return {
    temperatureFahrenheit: Math.round(openWeatherApiResponse.main.temp),
    stateOfSky: openWeatherApiResponse.weather[0].description,
    windSpeedMPH: Math.round(openWeatherApiResponse.wind.speed),
    windDirection: convertWindDegreeToWindDirection(
      openWeatherApiResponse.wind.deg
    ),
    humidityPercents: openWeatherApiResponse.main.humidity,
  };
};
