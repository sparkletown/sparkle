"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenueIdSchema = void 0;
const yup = require("yup");
const venue_1 = require("../utils/venue");
exports.VenueIdSchema = yup.string().matches(venue_1.VENUE_ID_REGEX).required();
//# sourceMappingURL=venue.js.map