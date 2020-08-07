export const DEFAULT_PROFILE_IMAGE = "/anonymous-profile-icon.jpeg";
export const DEFAULT_PARTY_NAME = "Anon";
export const SPARKLEVERSE_MARKETING_URL = "https://sparklever.se/";

export type TemplateType =
  | "ZOOM_ROOM"
  | "THEME_CAMP"
  | "PERFORMANCE_VENUE"
  | "ART_PIECE"
  | "ART_CAR";

export interface Template {
  type: TemplateType;
  name: string;
  description: Array<string>;
}

export const VENUE_TEMPLATES: Array<Template> = [
  {
    type: "ZOOM_ROOM",
    name: "Zoom Room",
    description: [
      "Give your Zoom room a place on the Playa",
      "Add descriptive details",
      "Customise entrance experience",
    ],
  },
  {
    type: "THEME_CAMP",
    name: "Theme Camp",
    description: [
      "Add your camp to the Playa in the form of a clickable map; then add tents, bars, domes and other spaces to your camp map. ",
    ],
  },
  {
    type: "PERFORMANCE_VENUE",
    name: "Performance Venue",
    description: [
      "Create a live performance space with tables, audience reactions and video chat between people in the venue.",
    ],
  },
  {
    type: "ART_PIECE",
    name: "Art Piece",
    description: [
      "Embed any 2-D or 3-D art experience with this special template, which allows viewers to chat to each other as they experience your art.",
    ],
  },
  {
    type: "ART_CAR",
    name: "Art Car",
    description: ["Create a space on the Playa that moves around."],
  },
];
