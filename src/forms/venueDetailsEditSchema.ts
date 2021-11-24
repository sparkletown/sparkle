import * as Yup from "yup";

import { VenueInput } from "api/admin";

// this is used to transform the api data to conform to the yup schema
// @debt I'm pretty sure every one of these .from that have the same fromKey / toKey are redundant noops and should be removed
export const venueDetailsEditSchema = Yup.object()
  .shape<Partial<VenueInput>>({})
  // possible locations for the subtitle
  .from("subtitle", "subtitle")
  .from("config.landingPageConfig.subtitle", "subtitle")

  .from("config.landingPageConfig.description", "description")
  .from("host.icon", "logoImageUrl")
  .from("showGrid", "showGrid")
  .from("showReactions", "showReactions")
  .from("enableJukebox", "enableJukebox")
  .from("hasSocialLoginEnabled", "hasSocialLoginEnabled")
  .from("showShoutouts", "showShoutouts")
  .from("columns", "columns")

  // possible locations for the banner image
  .from("config.landingPageConfig.coverImageUrl", "bannerImageUrl")
  .from("config.landingPageConfig.bannerImageUrl", "bannerImageUrl")

  .from("auditoriumColumns", "auditoriumColumns")
  .from("auditoriumRows", "auditoriumRows");
