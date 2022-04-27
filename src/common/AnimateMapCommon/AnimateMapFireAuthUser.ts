import { getAuth } from "firebase/auth";

export type AnimateMapFireAuthUser = ReturnType<typeof getAuth>["currentUser"];
