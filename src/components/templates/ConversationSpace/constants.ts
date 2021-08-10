import {
  DEFAULT_CONVERSATION_SPACE_TABLES_NUMBER,
  DEFAULT_TABLE_CAPACITY,
} from "settings";

import { Table } from "types/Table";

import { generateTables } from "utils/table";

export const TABLES: Table[] = generateTables({
  num: DEFAULT_CONVERSATION_SPACE_TABLES_NUMBER,
  capacity: DEFAULT_TABLE_CAPACITY,
});
