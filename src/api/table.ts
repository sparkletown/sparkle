import firebase from "firebase/app";

import { Table } from "types/Table";

export interface UpdateVenueTableProps {
  venueId: string;
  newTable: Table;
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
