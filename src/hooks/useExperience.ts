import { useMemo } from "react";

import { ALWAYS_EMPTY_OBJECT, DEFERRED } from "settings";

import { Experience } from "types/Firestore";
import { Table } from "types/Table";

import { useLiveDocument } from "./fire/useLiveDocument";

type UseExperience = (
  spaceName?: string
) => {
  tables: Record<string, Record<string, Table>>;
};

export const useExperience: UseExperience = (spaceName) => {
  const result = useLiveDocument<Experience>([
    "experiences",
    spaceName || DEFERRED,
  ]);

  const tables: Record<string, Record<string, Table>> =
    result?.data?.tables ?? ALWAYS_EMPTY_OBJECT;

  return useMemo(() => ({ ...result, tables }), [result, tables]);
};
