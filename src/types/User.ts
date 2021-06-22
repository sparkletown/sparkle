// @debt rename this file to be user rather than User

import * as Yup from "yup";

import { WithId, withId } from "utils/id";

export interface Experience {
  // @debt refactor bartender to be potentially undefined. Or can we remove it entirely?
  bartender: User;
  // @debt refactor table to be potentially undefined
  table: string;
  row?: number;
  column?: number;
}

// @debt typing I think this is correct from Room.tsx, need to confirm
// @debt This should probably be Partial<Record<string, Experience>> as otherwise it implies that an entry exists
//   for literally any arbitrary string
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

export interface UserLocation {
  lastSeenIn: { [key: string]: number };
  lastSeenAt: number;
}

export type UserWithLocation = User & UserLocation;

export enum UserStatus {
  available = "available",
  busy = "busy",
}

export enum UsernameVisibility {
  none = "none",
  hover = "hover",
  inline = "inline",
}

export const ExperienceSchema: Yup.ObjectSchema<Experience> = Yup.object()
  .shape({
    // @debt refactor bartender to be potentially undefined. Or can we remove it entirely?
    bartender: Yup.lazy(() => UserSchema.required()),
    // @debt refactor table to be potentially undefined
    table: Yup.string().required(),
    row: Yup.number(),
    column: Yup.number(),
  })
  .required();

export const UserExperienceDataSchema = Yup.lazy<
  UserExperienceData | undefined
>((data) => {
  const lazyObjectShape = Object.fromEntries(
    Object.keys(data ?? {}).map((key) => [key, ExperienceSchema])
  );

  return Yup.object().shape(lazyObjectShape).noUnknown();
});

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

/**
 * User validation schema.
 *
 * @see User
 */
export const UserSchema: Yup.ObjectSchema<User> = Yup.object()
  .shape<User>({
    partyName: Yup.string(),
    pictureUrl: Yup.string(),
    anonMode: Yup.boolean().required(),
    mirrorVideo: Yup.boolean().required(),
    status: Yup.string(),
    data: UserExperienceDataSchema,
    myPersonalizedSchedule: MyPersonalizedScheduleSchema,
    enteredVenueIds: Yup.array().of(Yup.string().required()),

    // Legacy?
    room: Yup.string(),
    video: VideoStateSchema.notRequired(),
    kidsMode: Yup.boolean().required(),
  })
  .noUnknown()
  .required();

export const userWithLocationToUser = (
  user: WithId<UserWithLocation>
): WithId<User> =>
  withId(UserSchema.validateSync(user, { stripUnknown: true }), user.id);
