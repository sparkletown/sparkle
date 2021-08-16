const yup = require("yup");

const { VENUE_ID_REGEX } = require("../utils/venue");

const VenueIdSchema = yup.string().matches(VENUE_ID_REGEX).required();

exports.VenueIdSchema = VenueIdSchema;
