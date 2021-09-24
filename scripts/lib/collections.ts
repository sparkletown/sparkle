import admin from "firebase-admin";

import { CollectionReference, SimContext } from "./types";

export const getChatlinesRef: (
  options: SimContext<"venueId">
) => Promise<CollectionReference> = async ({ venueId }) =>
  admin.firestore().collection("venues").doc(venueId).collection("chats");

export const getSectionsRef: (
  options: SimContext<"venueId">
) => Promise<CollectionReference> = async ({ venueId }) =>
  admin.firestore().collection("venues").doc(venueId).collection("sections");

export const getReactionsRef: (
  options: SimContext<"venueId">
) => Promise<CollectionReference> = async ({ venueId }) =>
  admin
    .firestore()
    .collection("experiences")
    .doc(venueId)
    .collection("reactions");

export const getUsersRef: () => Promise<CollectionReference> = async () =>
  admin.firestore().collection("users");

export const getVenueCollectionRef = () =>
  admin.firestore().collection("venues");

export const getVenueRef = (venueId: string) =>
  getVenueCollectionRef().doc(venueId);
