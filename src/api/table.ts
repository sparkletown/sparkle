import firebase from "firebase/app";

import { Table } from "types/Table";

export interface UpdateVenueTableProps {
  venueId: string;
  newTable: Table;
}

export const updateVenueTable = async ({
  venueId,
  newTable,
}: UpdateVenueTableProps) => {
  return await firebase.functions().httpsCallable("venue-updateTables")({
    venueId,
    newTable,
  });
};
