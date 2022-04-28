import * as fetch from "isomorphic-fetch";

const PROTOCOL = process.env.REACT_APP_FIRE_EMULATE_PROTOCOL || `http`;
const HOST = process.env.REACT_APP_FIRE_EMULATE_HOST || "127.0.0.1";
const HUB_PORT = 4400;

export const emulatorsInfo = async () => {
  const response = await fetch(`${PROTOCOL}://${HOST}:${HUB_PORT}/emulators`);
  if (response.status !== 200) {
    const text = await response.text();
    throw new Error(`Unable to get emulators info: ${text}`);
  }
  return await response.json();
};
