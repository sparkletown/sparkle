import Bugsnag from "@bugsnag/js";
import firebase from "firebase/compat/app";

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
  await firebase.functions().httpsCallable("venue-updateTables")({
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
  await firebase
    .functions()
    .httpsCallable("venue-deleteTable")({
      venueId,
      tableName,
      defaultTables,
    })
    .catch((e) => {
      Bugsnag.notify(e, (event) => {
        event.addMetadata("api/admin::deleteTable", {
          venueId,
          tableName,
        });
      });
      throw e;
    });
