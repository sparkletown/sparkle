"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfValidVenueId = exports.generateSlug = exports.VENUE_ID_REGEX = void 0;
const venue_1 = require("../types/venue");
exports.VENUE_ID_REGEX = /[a-z0-9_]{1,250}/;
const INVALID_SLUG_CHARS_REGEX = /[^a-zA-Z0-9]/g;
const generateSlug = (name) => name.replace(INVALID_SLUG_CHARS_REGEX, "").toLowerCase();
exports.generateSlug = generateSlug;
const checkIfValidVenueId = (venueId) => venue_1.VenueIdSchema.isValidSync(venueId);
exports.checkIfValidVenueId = checkIfValidVenueId;
//# sourceMappingURL=venue.js.map