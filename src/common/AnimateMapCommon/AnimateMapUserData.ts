import { User } from "types/User";

export interface AnimateMapUserData extends User {
  id: string;
  partyName?: string;
  messengerId: number; //playerio messager id
  pictureUrl?: string;
  dotColor: number; //hex
  hat?: string;
  accessories?: string;
  cycle?: string;
}
