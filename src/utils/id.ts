export type WithId<T extends object> = T & { id: string };
export type WithoutId<T extends object> = Omit<T, "id">;
