import { strict as assert } from "assert";

import chalk from "chalk";
import admin from "firebase-admin";

import { COLLECTION_SEATED_USERS_CHECKINS } from "settings";

import { User } from "types/User";

import { DocumentReference, GridSize, SimContext, TableInfo } from "./types";

export const getVenueRef: (
  options: SimContext<"venueId" | "log">
) => Promise<DocumentReference | undefined> = async ({ venueId, log }) => {
  const venueRef = admin.firestore().collection("venues").doc(venueId);
  const venueSnap = await venueRef.get();

  if (venueSnap.exists) {
    return venueRef;
  }

  log(
    chalk`{yellow.inverse WARN} venue with id {green ${venueId}} was not found.`
  );

  return;
};

export const getSeatedSectionUserRef: (
  options: SimContext<"venueId"> & { userId: string; sectionId: string }
) => Promise<DocumentReference> = async ({ venueId, userId, sectionId }) =>
  admin
    .firestore()
    .collection("venues")
    .doc(venueId)
    .collection("sections")
    .doc(sectionId)
    .collection("seatedSectionUsers")
    .doc(userId);

export const getRecentSeatedUsersUserRef: (
  options: SimContext<"venueId"> & { userId: string }
) => Promise<DocumentReference> = async ({ venueId, userId }) =>
  admin
    .firestore()
    .collection("venues")
    .doc(venueId)
    .collection(COLLECTION_SEATED_USERS_CHECKINS)
    .doc(userId);

export const getSeatedTableUserRef: (
  options: SimContext<"venueId"> & { userId: string }
) => Promise<DocumentReference> = async ({ venueId, userId }) =>
  admin
    .firestore()
    .collection("venues")
    .doc(venueId)
    .collection("seatedTableUsers")
    .doc(userId);

export const findUser: (options: {
  partyName: string;
  scriptTag?: string;
}) => Promise<User | undefined> = async ({ partyName, scriptTag }) => {
  let query = admin
    .firestore()
    .collection("users")
    .where("partyName", "==", partyName);

  if (scriptTag) {
    query = query.where("scriptTag", "==", scriptTag);
  }

  const snap = await query.get();
  assert.ok(
    snap.docs.length <= 1,
    chalk(
      `${findUser.name}(): Multiple users found for {magenta partyName}: {green ${partyName}} and {magenta scriptTag}: {green ${scriptTag}}`
    )
  );

  return snap.docs[0]?.data();
};

export const getVenueName: (
  options: SimContext<"venueRef" | "log">
) => Promise<string | undefined> = async ({ venueRef, log }) => {
  const name = (await (await venueRef.get()).data())?.name;
  if (!name) {
    log(
      chalk`{yellow.inverse WARN} Venue name was not found for venue with id {green ${venueRef.id}}.`
    );
  }
  return name;
};

export const getVenueTemplate: (
  options: SimContext<"venueRef" | "log">
) => Promise<string | undefined> = async ({ venueRef, log }) => {
  const name = (await (await venueRef.get()).data())?.template;
  if (!name) {
    log(
      chalk`{yellow.inverse WARN} Venue template was not found for venue with id {green ${venueRef.id}}.`
    );
  }
  return name;
};

export const getAuditoriumGridSize: (
  options: SimContext<"venueRef">
) => Promise<{} | GridSize> = async ({ venueRef }) => {
  const snap = await venueRef.get();
  const data = await snap.data();
  const { auditoriumColumns, auditoriumRows } = data ?? {};

  return auditoriumRows && auditoriumColumns
    ? {
        auditoriumColumns,
        auditoriumRows,
      }
    : {};
};

export const getVenueTablesInfo: (
  options: SimContext<"venueRef">
) => Promise<TableInfo[]> = async ({ venueRef }) => {
  const snap = await venueRef.get();
  const data = await snap.data();
  const tables = data?.config?.tables;

  return (tables ?? []).map(
    (
      {
        capacity,
        columns,
        reference,
        rows,
        title,
      }: Record<string, number | string | boolean>,
      idx: number
    ) => ({
      dub: title,
      idx,
      cap: Number.isSafeInteger(rows)
        ? capacity
        : Number.parseInt(`${capacity}`),
      col: Number.isSafeInteger(columns)
        ? columns
        : Number.parseInt(`${columns}`, 10),
      row: Number.isSafeInteger(rows) ? rows : Number.parseInt(`${rows}`, 10),
      ref: reference,
    })
  );
};
