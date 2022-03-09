import firebase from "firebase/compat/app";
import { TestMessageParams } from "yup";

import { createSlug } from "api/admin";

import { WorldId } from "types/id";

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
  const snap = await firebase
    .firestore()
    .collection("worlds")
    .where("slug", "==", slug)
    .where("isHidden", "==", false)
    .where(firebase.firestore.FieldPath.documentId(), "!=", worldId)
    .get();

  return !snap.docs.length;
};
