import firebase from "firebase/app";
import { omit } from "lodash";

import { ACCEPTED_IMAGE_TYPES } from "settings";

import { createUrlSafeName, World } from "api/admin";

import {
  WorldAdvancedFormInput,
  WorldEntranceFormInput,
  WorldStartFormInput,
} from "types/world";

import { generateFirestoreId, WithId, withId } from "utils/id";

export const createFirestoreWorldCreateInput: (
  input: WorldStartFormInput,
  user: firebase.UserInfo
) => Promise<Partial<World>> = async (input, user) => {
  const name = input.name;
  const slug = createUrlSafeName(name);

  return { name, slug };
};

export const createFirestoreWorldStartInput: (
  input: WithId<WorldStartFormInput>,
  user: firebase.UserInfo
) => Promise<Partial<World>> = async (input, user) => {
  // NOTE: id is needed before world is created to upload the images
  const id = input?.id ?? generateFirestoreId({ emulated: true });

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
      `users/${user.uid}/worlds/${id}/background.${extension}`
    );

    await uploadFileRef.put(file);
    imageInputData[key] = await uploadFileRef.getDownloadURL();
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
  input: WithId<WorldAdvancedFormInput>,
  user: firebase.UserInfo
) => Promise<Partial<World>> = async (input, user) => {
  const worldUpdateData: Partial<WithId<World>> = {};

  return worldUpdateData;
};

export const createFirestoreWorldAdvancedInput: (
  input: WithId<WorldAdvancedFormInput>,
  user: firebase.UserInfo
) => Promise<Partial<World>> = async (input, user) => {
  const worldUpdateData: Partial<WithId<World>> = {
    attendeesTitle: input.attendeesTitle,
  };

  return worldUpdateData;
};

export const createWorld = async (
  world: WorldStartFormInput,
  user: firebase.UserInfo
) => {
  // NOTE: due to interdependence on id and upload files' URLs:

  // 1. first a world stub is created
  const stubInput = await createFirestoreWorldCreateInput(world, user);

  const worldId = (
    await firebase.functions().httpsCallable("world-createWorld")(stubInput)
  )?.data;

  // 2. then world is properly updated, having necessary id
  const fullInput = await createFirestoreWorldStartInput(
    withId(world, worldId),
    user
  );

  await firebase.functions().httpsCallable("world-updateWorld")(fullInput);

  // 3. initial venue is created
  await firebase.functions().httpsCallable("venue-createVenue_v2")({
    ...fullInput,
    worldId,
  });
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
