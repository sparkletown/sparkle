import { strict as assert } from "assert";

import chalk from "chalk";
import admin from "firebase-admin";

import { User } from "types/User";

import { DocumentReference, GridSize, LogFunction } from "./types";

export type GetVenueRefOptions = {
  venueId: string;
  log: LogFunction;
};
export const getVenueRef: (
  options: GetVenueRefOptions
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

export type FindUserOptions = {
  partyName: string;
  scriptTag?: string;
};

export type FindUserResult = Promise<User | undefined>;

export const findUser: (options: FindUserOptions) => FindUserResult = async ({
  partyName,
  scriptTag,
}) => {
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

type GetVenueNameOptions = {
  venueRef: DocumentReference;
  log: LogFunction;
};

export const getVenueName: (
  options: GetVenueNameOptions
) => Promise<string | undefined> = async ({ venueRef, log }) => {
  const name = (await (await venueRef.get()).data())?.name;
  if (!name) {
    log(
      chalk`{yellow.inverse WARN} Venue name was not found for venue with id {green ${venueRef.id}}.`
    );
  }
  return name;
};

export type GetVenueGridSizeOptions = {
  venueRef: DocumentReference;
};

export type GetVenueGridSizeResult = {} | GridSize;

export const getVenueGridSize: (
  options: GetVenueGridSizeOptions
) => Promise<GetVenueGridSizeResult> = async ({ venueRef }) => {
  const snap = await venueRef.get();
  const data = await snap.data();
  const { auditoriumColumns, auditoriumRows, template } = data ?? {};
  const isAudience = template === "audience";

  return auditoriumRows && auditoriumColumns
    ? {
        minCol: isAudience ? -auditoriumColumns : 0,
        minRow: isAudience ? -auditoriumRows : 0,
        maxCol: auditoriumColumns,
        maxRow: auditoriumRows,
      }
    : {};
};
