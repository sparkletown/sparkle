import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

import { Table } from "types/Table";

export interface UpdateVenueTableProps {
  venueId: string;
  newTable?: Table;
  defaultTables: Table[];
}

export const updateVenueTable = async ({
  venueId,
  newTable,
  defaultTables,
}: UpdateVenueTableProps) => {
  return await firebase.functions().httpsCallable("venue-updateTables")({
    venueId,
    newTable,
    defaultTables,
  });
};

export interface DeleteVenueTableProps {
  venueId: string;
  tableName: string;
}

export const deleteTable = async ({
  venueId,
  tableName,
}: DeleteVenueTableProps) => {
  return await firebase
    .functions()
    .httpsCallable("venue-deleteTable")({
      venueId,
      tableName,
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
};
