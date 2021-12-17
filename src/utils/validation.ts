import firebase from "firebase/app";
import { TestMessageParams } from "yup";

import { createSlug } from "api/admin";

export const messageMustBeMinimum = (fieldName: string, min: number) =>
  `${fieldName} must be at least ${min} characters`;

export const messageMustBeMaximum = (fieldName: string, max: number) =>
  `${fieldName} must be less than ${max} characters`;

export const messageInvalidUrl = ({ path }: Partial<TestMessageParams>) =>
  `${path} is not a supported URL`;

export const testGeneratesValidSlug = (value: string) =>
  createSlug(value).length > 0;

export const testVenueByNameExists = async (value: string) =>
  !(
    value &&
    // @debt Replace with a function from api/worlds
    (
      await firebase
        .firestore()
        .collection("venues")
        .doc(createSlug(value))
        .get()
    ).exists
  );

export const testWorldBySlugExists = async (value: string) =>
  !(
    value &&
    // @debt Replace with a function from api/worlds
    (
      await firebase
        .firestore()
        .collection("worlds")
        .where("slug", "==", createSlug(value))
        .get()
    ).docs.length
  );
