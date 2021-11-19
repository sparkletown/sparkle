import * as Yup from "yup";

import { ROOM_TAXON } from "settings";

import { commonTitleSchema } from "forms/commonTitleSchema";
import { roomUrlSchema } from "forms/roomUrlSchema";

export interface RoomSchemaShape {
  title: string;
  venueName?: string;
  url?: string;
  useUrl?: boolean;
  image_url: string;
}

const roomImageUrlSchema = Yup.string().required(
  `${ROOM_TAXON.capital} icon is required`
);

export const spaceEditSchema = Yup.object().shape({
  room: Yup.object().shape<RoomSchemaShape>({
    title: commonTitleSchema,
    url: roomUrlSchema,
    image_url: roomImageUrlSchema,
  }),
});
