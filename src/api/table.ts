import firebase from "firebase/app";

import { MIN_TABLE_CAPACITY } from "settings";

import { Table } from "types/Table";

export interface UpdateVenueTableProps {
  venueId: string;
  tableOfUser: Table;
  tables: Table[];
  title: string;
  subtitle?: string;
  capacity: number | string;
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
  const capacityInteger = parseInt(capacity.toString(), 10);
  const tableColumns = tableOfUser?.columns ?? MIN_TABLE_CAPACITY;
  const updatedTable = {
    ...tableOfUser,
    title,
    subtitle,
    capacity: capacityInteger,
    // Math.ceil is used so that seats container displays with corrent height with uneven capacity
    rows: Math.ceil(capacityInteger / tableColumns),
  };

  return await firebase.functions().httpsCallable("venue-updateTables")({
    venueId,
    tables,
    updatedTable,
  });
};
