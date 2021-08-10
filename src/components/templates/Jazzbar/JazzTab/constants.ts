import {
  DEFAULT_JAZZBAR_TABLES_NUMBER,
  DEFAULT_TABLE_CAPACITY,
} from "settings";

import { Table } from "types/Table";

import { generateTables } from "utils/table";

export const JAZZBAR_TABLES: Table[] = generateTables({
  num: DEFAULT_JAZZBAR_TABLES_NUMBER,
  capacity: DEFAULT_TABLE_CAPACITY,
});
