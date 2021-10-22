import firebase from "firebase/app";
import { omit, pick } from "lodash";

import { ACCEPTED_IMAGE_TYPES } from "settings";

import { createUrlSafeName, World } from "api/admin";

import {
  WorldAdvancedFormInput,
  WorldEntranceFormInput,
  WorldStartFormInput,
} from "types/world";

import { WithId } from "utils/id";

export const createFirestoreWorldCreateInput: (
  input: WorldStartFormInput,
  user: firebase.UserInfo
) => Promise<Partial<World>> = async (input) => {
  const name = input.name;
  const slug = createUrlSafeName(name);

  return { name, slug };
};

export const createFirestoreWorldStartInput: (
  input: WorldStartFormInput,
  user: firebase.UserInfo
) => Promise<Partial<World>> = async (input, user) => {
  const slug = createUrlSafeName(input.name);
  const storageRef = firebase.storage().ref();

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
    const uploadFileRef = storageRef.child(
      `users/${user.uid}/worlds/${slug}/background.${extension}`
    );

    await uploadFileRef.put(file);
    imageInputData[key] = await uploadFileRef.getDownloadURL();
  }

  const worldUpdateData: Partial<WithId<World>> = {
    ...omit(input, Object.keys(imageInputs)),
    ...imageInputData,
    slug,
  };

  return worldUpdateData;
};

export const createFirestoreWorldEntranceInput: (
  input: WithId<WorldEntranceFormInput>,
  user: firebase.UserInfo
) => Promise<Partial<World>> = async (input, user) => {
  const worldUpdateData: Partial<WithId<World>> = {
    id: input.id,
    // save only to new place for new worlds, and if missing, read old ones for legacy worlds
    // questions: {
    //   code: input.code_of_conduct_questions,
    //   profile: input.profile_questions,
    // },
  };

  return worldUpdateData;
};

export const createFirestoreWorldAdvancedInput: (
  input: WithId<WorldAdvancedFormInput>,
  user: firebase.UserInfo
) => Promise<Partial<World>> = async (input, user) => {
  // mapping is 1:1, so just filtering out unintended extra fields
  return pick(input, [
    "id",
    "attendeesTitle",
    "chatTitle",
    "showNametags",
    "showBadges",
  ]);
};

export const createWorld: (
  world: WorldStartFormInput,
  user: firebase.UserInfo
) => Promise<{
  worldId?: string;
  error?: Error | unknown;
}> = async (world, user) => {
  // a way to share value between try and catch blocks
  const worldSlug = createUrlSafeName(world.name);
  try {
    // NOTE: due to interdependence on id and upload files' URLs:

    // 1. first a world stub is created
    const stubInput = {
      ...world,
      slug: worldSlug,
    };

    // 2. then world is properly updated, having necessary id
    const fullInput = await createFirestoreWorldStartInput(stubInput, user);

    await firebase.functions().httpsCallable("world-createWorld")(fullInput);

    // 3. initial venue is created
    // Temporary disabled due to possible complications and edge cases.
    // What if the inital venue has to be a template of choice
    // What if the venue already exists and it collides with the world name
    // etc..
    // await firebase.functions().httpsCallable("venue-createVenue_v2")({
    //   ...fullInput,
    //   worldId,
    // });

    // worldId might be useful for caller
    return { worldSlug };
  } catch (error) {
    // in order to prevent new worlds getting created due to subsequent errors
    // if an error is thrown here, but a world stub actually did get created
    // return the id along with the error so that caller can proceed with update instead
    return worldSlug ? { worldSlug, error } : { error };
  }
};

export const updateWorldStartSettings = async (
  world: WithId<WorldStartFormInput>,
  user: firebase.UserInfo
) => {
  return await firebase.functions().httpsCallable("world-updateWorld")(
    await createFirestoreWorldStartInput(world, user)
  );
};

export const updateWorldEntranceSettings = async (
  world: WithId<WorldEntranceFormInput>,
  user: firebase.UserInfo
) => {
  return await firebase.functions().httpsCallable("world-updateWorld")(
    await createFirestoreWorldEntranceInput(world, user)
  );
};

export const updateWorldAdvancedSettings = async (
  world: WithId<WorldAdvancedFormInput>,
  user: firebase.UserInfo
) => {
  return await firebase.functions().httpsCallable("world-updateWorld")(
    await createFirestoreWorldAdvancedInput(world, user)
  );
};
