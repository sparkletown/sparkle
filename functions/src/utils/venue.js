const { VenueIdSchema } = require("../types/venue");

const VENUE_ID_REGEX = /[a-z0-9_]{1,250}/;
const INVALID_SLUG_CHARS_REGEX = /[^a-zA-Z0-9]/g;

const generateSlug = (name) =>
  name.replace(INVALID_SLUG_CHARS_REGEX, "").toLowerCase();

const checkIfValidVenueId = (venueId) => VenueIdSchema.isValidSync(venueId);

exports.VENUE_ID_REGEX = VENUE_ID_REGEX;
exports.generateSlug = generateSlug;
exports.checkIfValidVenueId = checkIfValidVenueId;
