export const VALID_URL_PROTOCOLS = ["http:", "https:"];

export const isValidUrl = (urlString: string): urlString is string => {
  if (!urlString) return false;

  try {
    const url = new URL(urlString);

    return VALID_URL_PROTOCOLS.includes(url.protocol);
  } catch (e) {
    if (e instanceof TypeError) {
      return false;
    }
    throw e;
  }
};
