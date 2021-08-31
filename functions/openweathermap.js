const admin = require("firebase-admin");
const functions = require("firebase-functions");
const fetch = require("node-fetch");
const { parseJson } = require("./src/utils/misc");

const fetchWeather = async () => {
  const url =
    "https://api.openweathermap.org/data/2.5/weather?lat=40.787&lon=-119.206&units=imperial&lang=en&" +
    `appid=${functions.config().openweathermap.api_key}`;

  let response;
  try {
    response = await fetch(url);
  } catch (e) {
    console.error("OpenWeatherMap: error fetching weather. Error:", e);
    return undefined;
  }

  if (!response.ok) {
    console.error(
      "OpenWeatherMap: error fetching weather. Response: ",
      response
    );
    return undefined;
  }

  return parseJson(await response.text());
};

exports.updateCurrentBlackRockWeather = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async () => {
    const weather = await fetchWeather();

    if (weather) {
      await admin
        .firestore()
        .collection("weather")
        .doc("blackRock")
        .set(weather, { merge: true });
    } else {
      await admin.firestore().collection("weather").doc("blackRock").delete();
      console.log("OpenWeatherMap: deleted document from firestore");
    }
  });
