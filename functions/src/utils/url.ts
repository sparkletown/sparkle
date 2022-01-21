export const VALID_URL_PROTOCOLS = ["https:"];

export const isValidUrl = (urlString: string) => {
  if (!urlString) return false;

  try {
    const url = new URL(urlString);

    return VALID_URL_PROTOCOLS.includes(url.protocol);
  } catch (e) {
    // eslint-disable-next-line
    // @ts-ignore
    if (e?.name === "TypeError") {
      return false;
    }
    throw e;
  }
};
