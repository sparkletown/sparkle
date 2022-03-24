// These represent all of our templates (they should remain alphabetically sorted, deprecated should be separate from the rest)
// @debt unify this with VenueTemplate in functions/venue.js + share the same code between frontend/backend
export enum VenueTemplate {
  auditorium = "auditorium",
  conversationspace = "conversationspace",
  firebarrel = "firebarrel",
  jazzbar = "jazzbar",
  partymap = "partymap",
  animatemap = "animatemap",
  posterhall = "posterhall",
  posterpage = "posterpage",
  screeningroom = "screeningroom",
  viewingwindow = "viewingwindow",
  zoomroom = "zoomroom",
  experiment = "experiment",

  artpiece = "artpiece",
  /**
   * @deprecated Legacy template is going to be removed soon, try VenueTemplate.viewingwindow instead?
   */
  embeddable = "embeddable",
  /**
   * @deprecated Legacy template removed, perhaps try VenueTemplate.auditorium instead?
   */
  audience = "audience",
  /**
   * @deprecated Legacy template removed
   */
  artcar = "artcar",
  /**
   * @deprecated Legacy template removed
   */
  friendship = "friendship",
  /**
   * @deprecated Legacy template removed, perhaps try VenueTemplate.partymap instead?
   */
  themecamp = "themecamp",
  /**
   * @deprecated Legacy template removed
   */
  performancevenue = "performancevenue",
  /**
   * @deprecated Legacy template removed
   */
  avatargrid = "avatargrid",
  /**
   * @deprecated Legacy template removed, perhaps try VenueTemplate.partymap instead?
   */
  preplaya = "preplaya",

  /**
   * @deprecated Legacy template removed, perhaps try VenueTemplate.partymap instead?
   */
  playa = "playa",
}
