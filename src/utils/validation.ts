import firebase from "firebase/compat/app";
import { TestMessageParams } from "yup";

import { createSlug } from "api/admin";

import { WorldId } from "types/id";

import { SparkleFetchError } from "./error";

export const messageMustBeMinimum = (fieldName: string, min: number) =>
  `${fieldName} must be at least ${min} characters`;

export const messageMustBeMaximum = (fieldName: string, max: number) =>
  `${fieldName} must be less than ${max} characters`;

export const messageInvalidUrl = ({ path }: Partial<TestMessageParams>) =>
  `${path} is not a supported URL`;

export const testGeneratesValidSlug = (value: unknown) =>
  createSlug(value).length > 0;

export const testVenueByNameExists = async (value: unknown) => {
  const slug = createSlug(value);
  if (!slug) return false;

  // @debt Replace with a function from api/worlds
  const snap = await firebase.firestore().collection("venues").doc(slug).get();

  return !snap.exists;
};

export const testWorldBySlugExists = (worldId: WorldId) => async (
  value: unknown
) => {
  const slug = createSlug(value);
  if (!slug) return false;

  // @debt Replace with a function from api/worlds
  const basePath = firebase
    .firestore()
    .collection("worlds")
    .where("slug", "==", slug)
    .where("isHidden", "==", false);

  const path = worldId
    ? basePath.where(firebase.firestore.FieldPath.documentId(), "!=", worldId)
    : basePath;

  try {
    const { docs: foundWorlds } = await path.get();

    return !foundWorlds.length;
  } catch (error) {
    throw new SparkleFetchError({
      message: "Invalid fetch worlds request",
      args: {
        error,
        worldId,
        value,
      },
    });
  }
};
