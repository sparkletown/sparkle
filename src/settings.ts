export const DEFAULT_PROFILE_IMAGE = "/anonymous-profile-icon.jpeg";
export const DEFAULT_PARTY_NAME = "Anon";

export type TemplateType =
  | "ZOOM_ROOM"
  | "THEME_CAMP"
  | "PERFORMANCE_VENUE"
  | "ART_PIECE";

export interface Template {
  type: TemplateType;
  name: string;
  description: Array<string>;
}

export const VENUE_TEMPLATES: Array<Template> = [
  {
    type: "ZOOM_ROOM",
    name: "A Zoom Room",
    description: [
      "Simplist venue",
      "Add a link to zoom room",
      "Appear on playa map",
    ],
  },
  {
    type: "THEME_CAMP",
    name: "A Theme Camp",
    description: ["Clickable map", "Embed zooms, venues, and so on"],
  },
  {
    type: "PERFORMANCE_VENUE",
    name: "Performance Venue",
    description: ["Performance space", "Tables with video chat"],
  },
  {
    type: "ART_PIECE",
    name: "Art Piece",
    description: ["Clickable map", "Embed zooms, venues, and so on"],
  },
];
