const { VenueIdSchema } = require("../types/venue");

const VENUE_ID_REGEX = /[a-z0-9_]{1,250}/;

/**
 * @deprecated Use generateSlug instead.
 * @param {*} name
 * @returns
 */
const getVenueId = (name) => {
  return name.replace(/\W/g, "").toLowerCase();
};

const generateSlug = (name) => {
  return name.replace(/\W/g, "").toLowerCase();
};

const checkIfValidVenueId = (venueId) => VenueIdSchema.isValidSync(venueId);

exports.VENUE_ID_REGEX = VENUE_ID_REGEX;
exports.getVenueId = getVenueId;
exports.generateSlug = generateSlug;
exports.checkIfValidVenueId = checkIfValidVenueId;
