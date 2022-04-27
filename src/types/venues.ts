import { CSSProperties } from "react";

import { HAS_ROOMS_TEMPLATES } from "settings";

import { AuditoriumSectionPath } from "types/auditorium";
import { SpaceId, SpaceSlug, UserWithId } from "types/id";
import { RoomVisibility } from "types/RoomVisibility";
import { VenueTemplate } from "types/VenueTemplate";

import { Banner } from "./banner";
import { Poster } from "./posters";
import { Room } from "./rooms";
import { Table } from "./Table";
import { VenueAccessMode } from "./VenueAcccess";

export type PortalTemplate = VenueTemplate | "external";

// This type should have entries to exclude anything that has it's own specific type entry in AnyVenue below
export type GenericVenueTemplates = Exclude<
  VenueTemplate,
  | VenueTemplate.embeddable
  | VenueTemplate.jazzbar
  | VenueTemplate.partymap
  | VenueTemplate.posterpage
  | VenueTemplate.auditorium
  | VenueTemplate.experiment
  | VenueTemplate.artpiece
  | VenueTemplate.meetingroom
>;

// We shouldn't include 'Venue' here, that is what 'GenericVenue' is for (which correctly narrows the types; these should remain alphabetically sorted, except with GenericVenue at the top)
export type AnyVenue =
  | GenericVenue
  | AuditoriumVenue
  | EmbeddableVenue
  | JazzbarVenue
  | PartyMapVenue
  | PosterPageVenue
  | ExperimentalVenue
  | ArtPieceVenue
  | MeetingRoomVenue;

// @debt refactor into separated chunks (interface segregation principle).
// E.g. if certain params are only expected to be set for certain templates
// @debt The following keys are marked as required on this type, but i'm not sure they should be:
// termsAndConditions, width, height
export interface BaseVenue {
  template: VenueTemplate;
  parentId?: SpaceId;
  name: string;
  slug: SpaceSlug;
  access?: VenueAccessMode;
  config?: VenueConfig;
  host?: {
    icon: string;
  };
  owners?: string[];
  iframeUrl?: string;
  autoPlay?: boolean;
  zoomUrl?: string;
  mapBackgroundImageUrl?: string;
  radioStations?: string[];
  radioTitle?: string;
  banner?: Banner;
  samlAuthProviderId?: string;
  roomVisibility?: RoomVisibility;
  rooms?: Room[];
  start_utc_seconds?: number;
  end_utc_seconds?: number;
  showReactions?: boolean;
  showContent?: boolean;
  isReactionsMuted?: boolean;
  showShoutouts?: boolean;
  sectionsCount?: number;
  termsAndConditions: TermOfService[];
  showRadio?: boolean;
  createdAt?: number;
  recentUserCount?: number;
  recentUsersSample?: UserWithId[];
  recentUsersSampleSize?: number;
  updatedAt?: number;
  worldId: string;
  backgroundImageUrl?: string;
  presentUserCachedCount: number;
  // Optional: The space that manages this one. This is used for system managed
  // spaces such as poster pages and meeting room booths.
  managedBy?: SpaceId;

  // The isHidden flag is used to indicate that a system managed space has
  // been deleted by the system. We only hide it rather than delete it as
  // it should still be accessible to people who have been there and references
  // to spaces in things like analytics should still work.
  isHidden?: boolean;

  // Used by the empty booth tracker for understanding how long a booth has
  // been empty for.
  emptySince?: number;

  // Fields for implementing "booths" inside a jazzbar
  boothsEnabled?: boolean;
  maxBooths?: number;
  boothTemplateSpaceId?: SpaceId;
}

export interface GenericVenue extends BaseVenue {
  template: GenericVenueTemplates;
}

// @debt which of these params are exactly the same as on Venue? Can we simplify this?
// @debt we probably don't want to include id directly here.. that's what WithId is for
export interface PartyMapVenue extends BaseVenue {
  id: string;
  template: VenueTemplate.partymap;
}

export interface JazzbarVenue extends BaseVenue {
  template: VenueTemplate.jazzbar;
  iframeUrl: string;
  logoImageUrl: string;
  host: {
    icon: string;
  };
}

export interface ArtPieceVenue extends BaseVenue {
  template: VenueTemplate.artpiece;
  iframeUrl: string;
}

export interface MeetingRoomVenue extends BaseVenue {
  template: VenueTemplate.meetingroom;
  channels?: Channel[];
}

export interface ExperimentalVenue extends BaseVenue {
  template: VenueTemplate.experiment;
}

export interface EmbeddableVenue extends BaseVenue {
  template: VenueTemplate.embeddable;
  iframeUrl?: string;
  containerStyles?: CSSProperties;
  iframeStyles?: CSSProperties;
  iframeOptions?: Record<string, string>;
}

export interface PosterPageVenue extends BaseVenue {
  template: VenueTemplate.posterpage;
  poster?: Poster;
  isLive?: boolean;
}

export interface AuditoriumVenue extends BaseVenue {
  template: VenueTemplate.auditorium;
  title?: string;
}

interface TermOfService {
  name: string;
  text: string;
  link?: string;
}

export type SafeZone = {
  width: number;
  height: number;
};

export interface VenueConfig {
  theme: {
    primaryColor: string;
    backgroundColor?: string;
  };

  // @debt landingPageConfig should probably be 'potentially undefined', or is it guaranteed to exist everywhere?
  landingPageConfig: VenueLandingPageConfig;
  redirectUrl?: string;
  memberEmails?: string[];
  tables?: Table[];
  // See PartyMap for what safe zone means
  // These are expressed as a percentage of the total image width/height.
  // Expected range: 0.0 to 100.0.
  safeZone?: SafeZone;
}

// @debt The following keys are marked as required on this type, but i'm not sure they should be:
//   presentation, checkList
export interface VenueLandingPageConfig {
  coverImageUrl: string;
  subtitle?: string;
  description?: string;
  presentation: string[];
  checkList: string[];
  iframeUrl?: string;
  joinButtonText?: string;
}
export interface WorldEvent {
  name: string;
  startUtcSeconds: number;
  description: string;
  durationMinutes: number;
  host: string;
  id: string;
  orderPriority?: number;
  liveAudience?: number;
  spaceId: SpaceId;
  worldId: string;
}

export interface ScheduledEvent extends WorldEvent {
  isSaved: boolean;
  venueIcon: string;
  liveAudience: number;
}

export interface VenueTablePath {
  venueId: string;
  tableReference: string;
}

export type TableSeatedUsersVenuesTemplates =
  | VenueTemplate.jazzbar
  | VenueTemplate.conversationspace;

export type RecentSeatedUserData<T extends VenueTemplate> = {
  template: T;
  spaceId: string;
  worldId: string;
  venueSpecificData: T extends VenueTemplate.auditorium
    ? Pick<AuditoriumSectionPath, "sectionId">
    : T extends TableSeatedUsersVenuesTemplates
    ? {}
    : never;
};

export interface RecentSeatedUserTimestamp<T extends VenueTemplate>
  extends RecentSeatedUserData<T> {
  lastSittingTimeMs: number;
}

export const isVenueWithRooms = (venue: AnyVenue): venue is PartyMapVenue =>
  HAS_ROOMS_TEMPLATES.includes(venue.template);

export const isPartyMapVenue = (venue: AnyVenue): venue is PartyMapVenue =>
  venue.template === VenueTemplate.partymap;

export const isNotPartyMapVenue = (venue: AnyVenue) =>
  venue.template !== VenueTemplate.partymap;

export type Channel = {
  name: string;
  iframeUrl: string;
};

export type PortalOptionProps = {
  template?: PortalTemplate;
  name: string;
  id?: string;
  fieldName: string;
};
