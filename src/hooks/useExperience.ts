import { useMemo } from "react";
import { ObservableStatus } from "reactfire/src/useObservable";

import { Experience } from "types/Firestore";
import { Table } from "types/Table";

import { convertToFirestoreKey } from "utils/id";

import { useRefiDocument } from "hooks/fire/useRefiDocument";

type UseExperience = (
  spaceName?: string
) => ObservableStatus<Experience> & {
  tables: Record<string, Record<string, Table>>;
};

export const useExperience: UseExperience = (spaceName) => {
  const result = useRefiDocument<Experience>([
    "experiences",
    convertToFirestoreKey(spaceName),
  ]);

  const tables: Record<string, Record<string, Table>> = result?.data?.tables;

  return useMemo(() => ({ ...result, tables }), [result, tables]);
};
