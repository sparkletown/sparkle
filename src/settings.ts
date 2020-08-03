export const DEFAULT_PROFILE_IMAGE = "/anonymous-profile-icon.jpeg";
export const DEFAULT_PARTY_NAME = "Anon";

export interface Template {
  name: string;
  description: Array<string>;
}

export const VENUE_TEMPLATES: Array<Template> = [
  {
    name: "A Zoom Room",
    description: [
      "Simplist venue",
      "Add a link to zoom room",
      "Appear on playa map",
    ],
  },
  {
    name: "A Theme Camp",
    description: ["Clickable map", "Embed zooms, venues, and so on"],
  },
  {
    name: "Performance Venue",
    description: ["Performance space", "Tables with video chat"],
  },
  {
    name: "Art Piece",
    description: ["Clickable map", "Embed zooms, venues, and so on"],
  },
];
