import admin from "firebase-admin";

import { CollectionReference } from "./types";

export type GetChatlinesRefOptions = {
  venueId: string;
};
export const getChatlinesRef: (
  options: GetChatlinesRefOptions
) => Promise<CollectionReference> = async ({ venueId }) =>
  admin.firestore().collection("venues").doc(venueId).collection("chats");

export type GetSectionsRefOptions = {
  venueId: string;
};
export const getSectionsRef: (
  options: GetSectionsRefOptions
) => Promise<CollectionReference> = async ({ venueId }) =>
  admin.firestore().collection("venues").doc(venueId).collection("sections");

export type GetReactionsRefOptions = {
  venueId: string;
};
export const getReactionsRef: (
  options: GetReactionsRefOptions
) => Promise<CollectionReference> = async ({ venueId }) =>
  admin
    .firestore()
    .collection("experiences")
    .doc(venueId)
    .collection("reactions");

export const getUsersRef: () => Promise<CollectionReference> = async () =>
  admin.firestore().collection("users");
