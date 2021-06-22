const VALID_URL_PROTOCOLS = ["http:", "https:"];

const isValidUrl = (urlString) => {
  if (!urlString) return false;

  try {
    const url = new URL(urlString);

    return VALID_URL_PROTOCOLS.includes(url.protocol);
  } catch (e) {
    if (e.name === "TypeError") {
      return false;
    }
    throw e;
  }
};

exports.VALID_URL_PROTOCOLS = VALID_URL_PROTOCOLS;
exports.isValidUrl = isValidUrl;
