// @debt rename this file to be user rather than User

import * as Yup from "yup";

import { GridPosition } from "types/grid";
import { VenueTablePath } from "types/venues";

import { WithId } from "../utils/id";

export enum PlaceInTalkShowStudioVenue {
  stage = "stage",
  audience = "audience",
  requesting = "requesting",
}

export interface TalkShowStudioExperience {
  place?: PlaceInTalkShowStudioVenue;
  isSharingScreen?: boolean;
  isMuted?: boolean;
  isUserCameraOff?: boolean;
  cameraClientUid?: string;
  screenClientUid?: string;
}

export interface Experience extends TalkShowStudioExperience {
  bartender?: User;
  table?: string | null;
  row?: number | null;
  column?: number | null;
  sectionId?: string;
}

export type UserExperienceData = Record<string, Experience>;

// Store all things related to video chat where they can't be tampered with by other users
export type VideoState = {
  inRoomOwnedBy?: string;
  removedParticipantUids?: string[];
};

// the structure is { [key: venueId] : eventId[] }
export type MyPersonalizedSchedule = Partial<Record<string, string[]>>;

export interface ProfileLink {
  title: string;
  url: string;
}

export interface BaseUser {
  partyName?: string;
  pictureUrl?: string;
  anonMode?: boolean;
  mirrorVideo?: boolean;
  status?: string;
  data?: UserExperienceData;
  myPersonalizedSchedule?: MyPersonalizedSchedule;
  profileLinks?: ProfileLink[];
  talkShowExperience?: TalkShowStudioExperience;

  // forward compatible type: true/false now, can have other constants for finer grained access in the future
  // e.g. beta tester, demo or POC, maybe able to test A or B functionality not both etc.
  tester?: null | boolean | string | string[];

  // @debt typing - user also has a dynamic set of attributes for the question answers
  //   currently not possible to type them properly
  // [question: string]: string;

  // @debt these types are legacy and should be cleaned up across the codebase
  room?: string; // @debt: is this valid/used anymore? Use in JazzBarTableComponent, ProfileModal
  video?: VideoState; // @debt: is this valid/used anymore? Used in FireBarrel, Playa (Avatar, AvatarLayer, AvatarPartygoers, MyAvatar, Playa, VideoChatLayer
  kidsMode?: boolean; // @debt: is this valid/used anymore? Used in UserInformationContent, Playa
}

export interface User extends BaseUser {
  lastVenueIdSeenIn?: never;
  lastSeenAt?: never;
  enteredVenueIds?: string[];
}

export type DisplayUser = Pick<User, "partyName" | "pictureUrl" | "anonMode">;

export type TalkShowStudioUser = DisplayUser & Pick<User, "talkShowExperience">;

export type GridSeatedUser = DisplayUser & {
  position: Partial<GridPosition>;
};

export type TableSeatedUser = DisplayUser & {
  path: VenueTablePath;
};

export interface UserStatus {
  status: string;
  color: string;
}

export interface UserLocation {
  lastVenueIdSeenIn: string | null;
  lastSeenAt: number;
  enteredVenueIds?: string[];
}

export type UserWithLocation = BaseUser & UserLocation;

export enum UsernameVisibility {
  none = "none",
  hover = "hover",
  inline = "inline",
}

export const VideoStateSchema: Yup.ObjectSchema<VideoState> = Yup.object()
  .shape({
    inRoomOwnedBy: Yup.string(),
    removedParticipantUids: Yup.array().of(Yup.string().required()),
  })
  .required();

export const MyPersonalizedScheduleSchema = Yup.lazy<
  MyPersonalizedSchedule | undefined
>((data) => {
  const lazyObjectShape = Object.fromEntries(
    Object.keys(data ?? {}).map((key) => [
      key,
      Yup.array().of(Yup.string().required()),
    ])
  );

  return Yup.object().shape(lazyObjectShape).noUnknown();
});

export const userWithLocationToUser = (
  user: WithId<UserWithLocation>
): WithId<BaseUser> => {
  const { lastVenueIdSeenIn, lastSeenAt, ...userWithoutLocation } = user;

  return userWithoutLocation;
};
