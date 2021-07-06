import firebase from "firebase/app";
import { Table } from "types/Table";

export interface UpdateVenueTableProps {
  venueId: string;
  tableOfUser: Table;
  tables: Table[];
  title: string;
  subtitle?: string;
  capacity?: number;
}

export const updateVenueTable = async ({
  venueId,
  tableOfUser,
  tables,
  title,
  subtitle,
  capacity,
}: UpdateVenueTableProps) => {
  const updatedTable = {
    ...tableOfUser,
    title,
    subtitle,
    capacity,
  };

  return await firebase.functions().httpsCallable("venue-updateTables")({
    venueId,
    tables,
    updatedTable,
  });
};
