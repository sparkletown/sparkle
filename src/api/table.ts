import Bugsnag from "@bugsnag/js";
import { FIREBASE } from "core/firebase";
import { httpsCallable } from "firebase/functions";

import { Table } from "types/Table";

interface UpdateVenueTableOptions {
  venueId: string;
  newTable: Table;
  defaultTables: Table[];
}

export const updateVenueTable = async ({
  venueId,
  newTable,
  defaultTables,
}: UpdateVenueTableOptions) =>
  await httpsCallable(
    FIREBASE.functions,
    "venue-updateTables"
  )({
    venueId,
    newTable,
    defaultTables,
  });

interface DeleteVenueTableOptions {
  venueId: string;
  tableName: string;
  defaultTables: Table[];
}

export const deleteTable = async ({
  venueId,
  tableName,
  defaultTables,
}: DeleteVenueTableOptions) =>
  await httpsCallable(
    FIREBASE.functions,
    "venue-deleteTable"
  )({
    venueId,
    tableName,
    defaultTables,
  }).catch((e) => {
    Bugsnag.notify(e, (event) => {
      event.addMetadata("api/admin::deleteTable", {
        venueId,
        tableName,
      });
    });
    throw e;
  });
