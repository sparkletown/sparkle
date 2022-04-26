import Bugsnag from "@bugsnag/js";
import { FIREBASE } from "core/firebase";
import firebase from "firebase/compat/app";
import { httpsCallable } from "firebase/functions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { isEmpty, omit, pick } from "lodash";

import {
  ACCEPTED_IMAGE_TYPES,
  COLLECTION_SEATED_USERS,
  COLLECTION_SEATED_USERS_CHECKINS,
  COLLECTION_WORLDS,
  FIELD_SLUG,
} from "settings";

import { createSlug } from "api/admin";

import { EntranceStepConfig } from "types/EntranceStep";
import { UserId, WorldId, WorldSlug } from "types/id";
import { Question } from "types/Question";
import { DisplayUser, SeatedUser } from "types/User";
import {
  WorldAdvancedFormInput,
  WorldEntranceFormInput,
  WorldGeneralFormInput,
  WorldScheduleSettings,
} from "types/world";

import { pickDisplayUserFromUser } from "utils/chat";
import { generateFirestoreId, WithId, withId } from "utils/id";
import { getCurrentTimeInMilliseconds } from "utils/time";
import { isDefined } from "utils/types";

// NOTE: world might have many fields, please keep them in alphabetic order
export interface World {
  adultContent?: boolean;
  attendeesTitle?: string;
  config: {
    landingPageConfig: {
      coverImageUrl: string;
      description?: string;
      subtitle?: string;
    };
  };
  createdAt: Date;
  entrance?: EntranceStepConfig[];
  endTimeUnix?: number;
  host: {
    icon: string;
  };
  name: string;
  owners: string[];
  questions?: {
    code?: Question[];
  };
  radioStations?: string[];
  requiresDateOfBirth?: boolean;
  showBadges?: boolean;
  showRadio?: boolean;
  showSchedule?: boolean;
  slug: WorldSlug;
  startTimeUnix?: number;
  updatedAt: Date;
  hasSocialLoginEnabled?: boolean;
}

export const createFirestoreWorldCreateInput: (
  input: WorldGeneralFormInput
) => Promise<Partial<World>> = async (input) => {
  const name = input.name;
  const slug = createSlug(name) as WorldSlug;

  return { name, slug };
};

export const createFirestoreWorldStartInput: (
  input: WithId<WorldGeneralFormInput>,
  user: firebase.UserInfo
) => Promise<Partial<World>> = async (input, user) => {
  // NOTE: id is needed before world is created to upload the images
  const id = input?.id ?? generateFirestoreId({ emulated: true });

  const slug = createSlug(input.name) as WorldSlug;

  const imageInputData: Record<string, string> = {};

  const imageInputs = {
    logoImageUrl: input.logoImageFile,
    bannerImageUrl: input.bannerImageFile,
  };

  // upload the files
  for (const [key, value] of Object.entries(imageInputs)) {
    const file = value?.[0];

    if (!file) continue;

    const type = file.type;
    if (!ACCEPTED_IMAGE_TYPES.includes(type)) continue;

    const extension = type.split("/").pop();
    const uploadFileRef = ref(
      FIREBASE.storage,
      `users/${user.uid}/worlds/${id}/${key}.${extension}`
    );

    await uploadBytes(uploadFileRef, file);
    imageInputData[key] = await getDownloadURL(uploadFileRef);
  }

  const worldUpdateData: Partial<WithId<World>> = {
    ...omit(input, Object.keys(imageInputs)),
    ...imageInputData,
    id,
    slug,
  };

  return worldUpdateData;
};

export const createFirestoreWorldEntranceInput: (
  input: WithId<WorldEntranceFormInput>
) => Promise<Partial<World>> = async (input) => {
  const worldUpdateData: Partial<WithId<World>> = {
    id: input.id,
    adultContent: input?.adultContent,
    requiresDateOfBirth: input?.requiresDateOfBirth,
    questions: {
      code: input?.code ?? [],
    },
    entrance: isEmpty(input.entrance) ? [] : input.entrance,
  };

  return worldUpdateData;
};

export const createFirestoreWorldAdvancedInput: (
  input: WithId<WorldAdvancedFormInput>,
  user: firebase.UserInfo
) => Promise<Partial<World>> = async (input, user) => {
  // mapping is mostly 1:1, so just filtering out unintended extra fields
  const picked = pick(input, [
    "id",
    "attendeesTitle",
    "showBadges",
    "showRadio",
    "showSchedule",
    "hasSocialLoginEnabled",
  ]);

  // Form input is just a single string, but DB structure is string[]
  const radioStations = isDefined(input.radioStation)
    ? [input.radioStation]
    : undefined;

  return { ...picked, radioStations };
};

export const createFirestoreWorldScheduleInput: (
  input: WithId<WorldScheduleSettings>
) => Promise<Partial<World>> = async (input) => {
  const worldUpdateData: Partial<WithId<World>> = {
    id: input.id,
    startTimeUnix: input?.startTimeUnix,
    endTimeUnix: input?.endTimeUnix,
  };

  return worldUpdateData;
};

export const createWorld: (
  world: WorldGeneralFormInput,
  user: firebase.UserInfo
) => Promise<{
  worldId?: string;
  error?: Error | unknown;
}> = async (world, user) => {
  // a way to share value between try and catch blocks
  let worldId = "";
  try {
    // NOTE: due to interdependence on id and upload files' URLs:

    // 1. first a world stub is created
    const stubInput = await createFirestoreWorldCreateInput(world);

    const newWorld = (
      await httpsCallable<Partial<World>, WithId<World>>(
        FIREBASE.functions,
        "world-createWorld"
      )(stubInput)
    )?.data;

    worldId = newWorld.id;

    // 2. then world is properly updated, having necessary id
    const fullInput = await createFirestoreWorldStartInput(
      withId(world, worldId),
      user
    );

    await httpsCallable(FIREBASE.functions, "world-updateWorld")(fullInput);

    // 3. initial venue is created
    // Temporary disabled due to possible complications and edge cases.
    // What if the inital venue has to be a template of choice
    // What if the venue already exists and it collides with the world name
    // etc..
    // await httpsCallable(FIREBASE.functions, "venue-createVenue_v2")({
    //   ...fullInput,
    //   worldId,
    // });

    // worldId might be useful for caller
    return { worldId };
  } catch (error) {
    // in order to prevent new worlds getting created due to subsequent errors
    // if an error is thrown here, but a world stub actually did get created
    // return the id along with the error so that caller can proceed with update instead
    return worldId ? { worldId, error } : { error };
  }
};

export const updateWorldStartSettings = async (
  world: WithId<WorldGeneralFormInput>,
  user: firebase.UserInfo
) => {
  return await httpsCallable(
    FIREBASE.functions,
    "world-updateWorld"
  )(await createFirestoreWorldStartInput(world, user));
};

export const updateWorldEntranceSettings = async (
  world: WithId<WorldEntranceFormInput>
) => {
  return await httpsCallable(
    FIREBASE.functions,
    "world-updateWorld"
  )(await createFirestoreWorldEntranceInput(world));
};

export const updateWorldAdvancedSettings = async (
  world: WithId<WorldAdvancedFormInput>,
  user: firebase.UserInfo
) => {
  return await httpsCallable(
    FIREBASE.functions,
    "world-updateWorld"
  )(await createFirestoreWorldAdvancedInput(world, user));
};

export const updateWorldScheduleSettings = async (
  world: WithId<WorldScheduleSettings>
) => {
  return await httpsCallable(
    FIREBASE.functions,
    "world-updateWorld"
  )(await createFirestoreWorldScheduleInput(world));
};

export const addWorldAdmins = async (worldId: WorldId, userIds: UserId[]) =>
  await httpsCallable(
    FIREBASE.functions,
    "world-addWorldAdmins"
  )({ worldId, userIds });

export const removeWorldAdmin = async (worldId: WorldId, userId: UserId) => {
  return await httpsCallable(
    FIREBASE.functions,
    "world-removeWorldAdmin"
  )({ worldId, userId });
};

export type FindWorldBySlugOptions = {
  worldSlug: string;
};

export const fetchWorld = async (worldId: string) => {
  const venueDoc = await firebase
    .firestore()
    .collection(COLLECTION_WORLDS)
    .doc(worldId)
    .get();
  return venueDoc.data() as World;
};

export const findWorldBySlug = async ({
  worldSlug,
}: FindWorldBySlugOptions) => {
  if (!worldSlug) {
    throw new Error("The worldSlug should be provided");
  }

  const worldsRef = await firebase
    .firestore()
    .collection(COLLECTION_WORLDS)
    .where("isHidden", "==", false)
    .where(FIELD_SLUG, "==", worldSlug)
    .get();

  const worlds = worldsRef.docs;

  if (worlds.length > 1) {
    Bugsnag.notify(
      `Multiple worlds have been found with the following slug: ${worldSlug}.`,
      (event) => {
        event.severity = "warning";
        event.addMetadata("api/world::findWorldBySlug", {
          worldSlug,
          worlds,
        });
      }
    );
  }

  return worlds?.[0];
};

const getUserInSectionRef = (userId: string, worldId: string) => {
  return firebase
    .firestore()
    .collection(COLLECTION_WORLDS)
    .doc(worldId)
    .collection(COLLECTION_SEATED_USERS)
    .doc(userId);
};
interface setSeatOptions<T> {
  user: WithId<DisplayUser>;
  worldId: string;
  spaceId: string;
  seatData: T;
}

export const setSeat = async <T>({
  user,
  worldId,
  spaceId,
  seatData,
}: setSeatOptions<T>) => {
  const data: SeatedUser<T> = {
    ...pickDisplayUserFromUser(user),
    worldId,
    spaceId,
    seatData,
  };
  return getUserInSectionRef(user.id, worldId).set(data);
};

interface unsetSeatOptions {
  userId: string;
  worldId: string;
}

export const unsetSeat = async ({ userId, worldId }: unsetSeatOptions) => {
  getUserInSectionRef(userId, worldId).delete();
};

const getRecentSeatedUserRef = (worldId: string, userId: string) =>
  firebase
    .firestore()
    .collection(COLLECTION_WORLDS)
    .doc(worldId)
    .collection(COLLECTION_SEATED_USERS_CHECKINS)
    .doc(userId);

interface updateSeatedDataOptions {
  userId: string;
  worldId: string;
}

/**
 * Checkins are performed in a separate collection to the seating data itself.
 * This is to avoid any listeners for changes to the seating data from being
 * bombarded with lots of change notifications.
 */
export const doSeatingCheckin = async ({
  userId,
  worldId,
}: updateSeatedDataOptions) => {
  const withTimestamp = {
    worldId,
    lastSittingTimeMs: getCurrentTimeInMilliseconds(),
  };

  return getRecentSeatedUserRef(worldId, userId).set(withTimestamp);
};

export const clearSeatingCheckin = async ({
  userId,
  worldId,
}: updateSeatedDataOptions) => {
  getRecentSeatedUserRef(worldId, userId).delete();
};
