import admin from "firebase-admin";

import { CollectionReference, DocumentData } from "./types";

export type GetChatRefOptions = {
  venueId: string;
};
export const getChatRef: (
  options: GetChatRefOptions
) => Promise<CollectionReference<DocumentData>> = async ({ venueId }) =>
  admin.firestore().collection("venues").doc(venueId).collection("chats");

export type GetReactionsRefOptions = {
  venueId: string;
};
export const getReactionsRef: (
  options: GetReactionsRefOptions
) => Promise<CollectionReference<DocumentData>> = async ({ venueId }) =>
  admin
    .firestore()
    .collection("experiences")
    .doc(venueId)
    .collection("reactions");
