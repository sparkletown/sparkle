const PROTOCOL = process.env.REACT_APP_FIRE_EMULATE_PROTOCOL || `http`;
const HOST = process.env.REACT_APP_FIRE_EMULATE_HOST || "127.0.0.1";
const PORT = process.env.PORT;

export const determineBaseUrl = (original: string | null) => {
  if (process.env.CYPRESS_BASE_URL) {
    const newOne = process.env.CYPRESS_BASE_URL;
    console.log("CYPRESS_BASE_URL environment variable provided");
    console.log("Setting baseUrl to", newOne, "instead of", original);
    return newOne;
  }

  if (PORT) {
    const newOne = `${PROTOCOL}://${HOST}:${PORT}`;
    console.log("PORT environment variable provided");
    console.log("Setting baseUrl to", newOne, "instead of", original);
    return newOne;
  }

  const newOne = original ?? null;
  console.log("baseUrl is set to", newOne);
  return newOne;
};
