import firebase from "firebase/app";
import { MIN_TABLE_CAPACITY } from "settings";
import { Table } from "types/Table";

export interface UpdateVenueTableProps {
  venueId: string;
  tableOfUser: Table;
  tables: Table[];
  title: string;
  subtitle?: string;
  capacity: number;
}

export const updateVenueTable = async ({
  venueId,
  tableOfUser,
  tables,
  title,
  subtitle,
  capacity,
}: UpdateVenueTableProps) => {
  // @debt: capacity type equals number, but incoming value is string. Needs to be fixed in table types
  const updatedCapacity = parseInt(capacity.toString(), 10);
  const tableColumns = tableOfUser?.columns ?? MIN_TABLE_CAPACITY;
  const updatedTable = {
    ...tableOfUser,
    title,
    subtitle,
    capacity: updatedCapacity,
    rows: Math.ceil(updatedCapacity / tableColumns),
  };

  return await firebase.functions().httpsCallable("venue-updateTables")({
    venueId,
    tables,
    updatedTable,
  });
};
