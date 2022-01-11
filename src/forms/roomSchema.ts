import * as Yup from "yup";

import { ROOM_TAXON } from "settings";

import { RoomVisibility } from "types/RoomVisibility";

import { createNameSchema } from "forms/factory/createNameSchema";
export interface RoomSchemaShape {
  title: string;
  image_url: string;
  spaceId?: string;
  type?: boolean;
  visibility?: RoomVisibility;
  isEnabled?: boolean;
}

export const roomSchema = Yup.object().shape<RoomSchemaShape>({
  title: createNameSchema({ name: "Title", withMin: true }),
  image_url: Yup.string().required(`${ROOM_TAXON.capital} icon is required`),
});
