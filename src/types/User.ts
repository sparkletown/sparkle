// @debt rename this file to be user rather than User

export interface Experience {
  bartender: User;
  table: string;
  row?: number;
  column?: number;
}

//@debt typing I think this is correct from Room.tsx, need to confirm
export type UserExperienceData = Record<string, Experience>;

// Store all things related to video chat where they can't be tampered with by other users
export type VideoState = {
  inRoomOwnedBy?: string;
  removedParticipantUids?: string[];
};

// the structure is { [key: venueId] : eventId[] }
export type MyPersonalizedSchedule = Partial<Record<string, string[]>>;

export interface User {
  partyName?: string;
  pictureUrl?: string;
  anonMode: boolean;
  mirrorVideo: boolean;
  status?: string;
  data?: UserExperienceData;
  myPersonalizedSchedule?: MyPersonalizedSchedule;
  enteredVenueIds?: string[];
  lastSeenIn: { [key: string]: number };
  lastSeenAt: number;

  // @debt typing - user also has a dynamic set of attributes for the question answers
  //   currently not possible to type them properly
  // [question: string]: string;

  // Legacy?
  room?: string; // @debt: is this valid/used anymore? Use in JazzBarTableComponent, UserProfileModal
  video?: VideoState; // @debt: is this valid/used anymore? Used in FireBarrel, Playa (Avatar, AvatarLayer, AvatarPartygoers, MyAvatar, Playa, VideoChatLayer
  kidsMode: boolean; // @debt: is this valid/used anymore? Used in UserInformationContent, Playa
  // @debt these don't appear to be used by anything anymore
  // drinkOfChoice?: string;
  // favouriteRecord?: string;
  // doYouDance?: string;
}

export enum UserStatus {
  available = "available",
  busy = "busy",
}

export enum UsernameVisibility {
  none = "none",
  hover = "hover",
  inline = "inline",
}
