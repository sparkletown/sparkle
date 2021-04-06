import { Table } from "types/Table";

const jazzBarTable = (index: number): Table => ({
  capacity: 6,
  title: `Table ${index}`,
  reference: `jazzbar-table-${index}`,
  rows: 2,
  columns: 3,
});

export const JAZZBAR_TABLES: Table[] = new Array(12)
  .fill(0)
  .map((_, index) => jazzBarTable(index + 1));
