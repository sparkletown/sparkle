// Temporary place as a reference for UI/UX taxonomy
// (will make it easy to find occurrences)
// until more comprehensive solution is available

export type TAXON = Readonly<{
  capital: string;
  title: string;
  lower: string;
  upper: string;
}>;

export const SPACE_TAXON: TAXON = {
  capital: "Space",
  title: "Space",
  lower: "space",
  upper: "SPACE",
};

export const ROOM_TAXON: TAXON = {
  capital: "Portal",
  title: "Portal",
  lower: "portal",
  upper: "PORTAL",
};

export const ROOMS_TAXON: TAXON = {
  capital: "Portals",
  title: "Portals",
  lower: "portals",
  upper: "PORTALS",
};

export const SCREENING_ROOM_TAXON: TAXON = {
  capital: "Screening room",
  title: "Screening Room",
  lower: "screening room",
  upper: "SCREENING ROOM",
};

export const ZOOM_ROOM_TAXON: TAXON = {
  capital: "Zoom room",
  title: "Zoom Room",
  lower: "zoom room",
  upper: "ZOOM ROOM",
};
