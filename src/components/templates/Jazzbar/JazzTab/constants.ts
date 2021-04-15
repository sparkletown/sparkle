import { Table } from "types/Table";

import { generateTables } from "utils/table";

export const JAZZBAR_TABLES: Table[] = generateTables({ num: 12, capacity: 6 });
