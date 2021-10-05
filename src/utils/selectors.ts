import { FirebaseReducer } from "react-redux-firebase";

import { RootState } from "store";

import { ArtCar, Firebarrel } from "types/animateMap";
import { AuditoriumSeatedUser } from "types/auditorium";
import {
  ChatSettings,
  JukeboxMessage,
  PrivateChatMessage,
  VenueChatMessage,
} from "types/chat";
import { Experience } from "types/Firestore";
import { Reaction, TextReaction, TextReactionType } from "types/reactions";
import { ScreeningRoomVideo } from "types/screeningRoom";
import { Settings } from "types/settings";
import { SparkleSelector } from "types/SparkleSelector";
import { TableSeatedUser, User, UserWithLocation } from "types/User";
import { AnyVenue, PosterPageVenue, VenueEvent } from "types/venues";

import { WithId } from "utils/id";

import {
  makeDataSelector,
  makeIsRequestedSelector,
  makeIsRequestingSelector,
  makeOrderedSelector,
} from "./firestoreSelectors";

/**
 * Selector to retrieve Firebase auth from Redux.
 *
 * @param state the Redux store
 */
export const authSelector: SparkleSelector<FirebaseReducer.AuthState> = (
  state
) => state.firebase.auth;

/**
 * Selector to retrieve Firebase profile from Redux.
 *
 * @param state the Redux store
 */
export const profileSelector: SparkleSelector<
  FirebaseReducer.Profile<UserWithLocation>
> = (state) => {
  // @debt refactor userWithLocationToUser to optionally not require WithId, then use that here
  return state.firebase.profile;
};

/**
 * Selector to retrieve currentVenue?.[0] from the Redux Firestore.
 *
 * @param state the Redux store
 */
export const currentVenueSelector: SparkleSelector<
  WithId<AnyVenue> | undefined
> = (state) => state.firestore.ordered.currentVenue?.[0];

export const currentEventSelector: SparkleSelector<
  WithId<VenueEvent>[] | undefined
> = makeOrderedSelector("currentEvent");

export const shouldRetainAttendanceSelector: SparkleSelector<boolean> = (
  state
) => state.attendance.retainAttendance;

export const isCurrentVenueNGRequestedSelector: SparkleSelector<boolean> = makeIsRequestedSelector(
  "currentVenueNG"
);

export const isCurrentVenueNGRequestingSelector: SparkleSelector<boolean> = makeIsRequestingSelector(
  "currentVenueNG"
);

export const isCurrentVenueRequestedSelector: SparkleSelector<boolean> = makeIsRequestedSelector(
  "currentVenue"
);

export const isCurrentVenueRequestingSelector: SparkleSelector<boolean> = makeIsRequestingSelector(
  "currentVenue"
);

export const isCurrentEventRequestedSelector: SparkleSelector<boolean> = makeIsRequestedSelector(
  "currentEvent"
);

export const venueChatMessagesSelector: SparkleSelector<
  WithId<VenueChatMessage>[] | undefined
> = (state) => state.firestore.ordered.venueChatMessages;

export const jukeboxMessagesSelector: SparkleSelector<
  WithId<JukeboxMessage>[] | undefined
> = (state) => state.firestore.ordered.venueJukeboxMessages;

export const privateChatMessagesSelector: SparkleSelector<
  WithId<PrivateChatMessage>[] | undefined
> = (state) => state.firestore.ordered.privateChatMessages;

// @debt this doesn't appear to be used by anything anymore
// export const chatUsersByIdSelector: SparkleSelector<
//   Record<string, User> | undefined
// > = (state) => state.firestore.data.chatUsers;

export const experienceSelector: SparkleSelector<Experience | undefined> = (
  state
) => state.firestore.data.experience;

export const reactionsSelector: SparkleSelector<
  WithId<Reaction>[] | undefined
> = (state) => state.firestore.ordered.reactions;

export const messagesToTheBandSelector: SparkleSelector<
  WithId<TextReaction>[] | undefined
> = (state) =>
  reactionsSelector(state)?.filter(
    (reaction): reaction is WithId<TextReaction> =>
      reaction.reaction === TextReactionType
  );

export const venueSelector = (state: RootState) =>
  state.firestore.ordered.currentVenue?.[0];

export const venueEventsSelector: SparkleSelector<
  WithId<VenueEvent>[] | undefined
> = (state) => state.firestore.ordered.venueEvents;

export const venueEventsNGSelector = (state: RootState) =>
  state.firestore.ordered.events;

export const radioStationsSelector = (state: RootState) =>
  state.firestore.data.currentVenue?.radioStations;

export const posterVenuesSelector: SparkleSelector<
  WithId<PosterPageVenue>[] | undefined
> = (state) => state.firestore.ordered.posterVenues;

export const screeningRoomVideosSelector: SparkleSelector<
  WithId<ScreeningRoomVideo>[] | undefined
> = (state) => state.firestore.ordered.screeningRoomVideos;

export const animateMapFirebarrelsSelector: SparkleSelector<
  WithId<Firebarrel>[] | undefined
> = (state) => state.firestore.ordered.animatemapFirebarrels;

export const animateMapArtCarsSelector: SparkleSelector<
  WithId<ArtCar>[] | undefined
> = (state) => state.firestore.ordered.animatemapArtcars;

export const chatVisibilitySelector: SparkleSelector<boolean> = (state) =>
  state.chat.isChatSidebarVisible;

export const currentAuditoriumSectionSeatedUsersSelector: SparkleSelector<
  WithId<AuditoriumSeatedUser>[] | undefined
> = makeOrderedSelector("currentAuditoriumSeatedSectionUsers");

export const currentAuditoriumSectionSeatedUsersByIdSelector: SparkleSelector<
  Partial<Record<string, AuditoriumSeatedUser>> | undefined
> = makeDataSelector("currentAuditoriumSeatedSectionUsers");

export const currentSeatedTableUsersSelector: SparkleSelector<
  WithId<TableSeatedUser>[] | undefined
> = makeOrderedSelector("currentSeatedTableUsers");

export const currentSeatedTableUsersByIdSelector: SparkleSelector<
  Record<string, TableSeatedUser> | undefined
> = makeDataSelector("currentSeatedTableUsers");

export const currentModalUserDataSelector: SparkleSelector<
  User | undefined
> = makeDataSelector("currentModalUser");

export const userProfileSelector: SparkleSelector<string | undefined> = (
  state
) => state.userProfile.userId;

export const selectedChatSettingsSelector: SparkleSelector<ChatSettings> = (
  state
) => state.chat.settings;

export const maybeSelector = <T>(
  ifTrue: boolean,
  selector: SparkleSelector<T>
): SparkleSelector<T> | SparkleSelector<undefined> =>
  ifTrue ? selector : noopSelector;

export const maybeArraySelector = <T>(
  ifTrue: boolean,
  selector: SparkleSelector<T[]>
): SparkleSelector<T[]> => (ifTrue ? selector : emptyArraySelector);

export const noopSelector: SparkleSelector<undefined> = () => undefined;

export const emptyArray = [];
export const emptyArraySelector = <T>(): T[] => emptyArray;

export const ownedVenuesDataSelector: SparkleSelector<
  Record<string, AnyVenue> | undefined
> = (state) => state.firestore.data.ownedVenues;

export const ownedVenuesSelector: SparkleSelector<
  WithId<AnyVenue>[] | undefined
> = (state) => state.firestore.ordered.ownedVenues;

export const animateMapEnvironmentSoundSelector: SparkleSelector<boolean> = (
  state
) => state.animatemap.environmentSound;

export const animateMapFirstEntranceSelector: SparkleSelector<string | null> = (
  state
) => state.animatemap.firstEntrance;

export const settingsSelector: SparkleSelector<Settings | undefined> = (
  state
) => state.firestore.data.settings;
