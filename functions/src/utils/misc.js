const parseJson = (input) => {
  try {
    return JSON.parse(input);
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

exports.parseJson = parseJson;
