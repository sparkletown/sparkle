const getVenueId = (name) => {
  return name.replace(/\W/g, "").toLowerCase();
};

const checkIfValidVenueId = (venueId) => {
  if (typeof venueId !== "string") return false;

  return /[a-z0-9_]{1,250}/.test(venueId);
};

exports.getVenueId = getVenueId;
exports.checkIfValidVenueId = checkIfValidVenueId;
