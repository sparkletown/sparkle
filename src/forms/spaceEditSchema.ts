import * as Yup from "yup";

import { ROOM_TAXON } from "settings";

import { createNameSchema } from "forms/factory/createNameSchema";
import { roomUrlSchema } from "forms/roomUrlSchema";

import { validUrlSchema } from "./validUrlSchema";

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

const roomSchema = Yup.object().shape<RoomSchemaShape>({
  title: createNameSchema({ name: "Title", withMin: true }),
  image_url: roomImageUrlSchema,
});

const roomSchemaWithUrl = { ...roomSchema, url: roomUrlSchema };

export const spaceEditSchema = Yup.object().shape({
  room: roomSchema,
  venue: Yup.object().shape({
    iframeUrl: validUrlSchema,
  }),
});

export const externalSpaceEditSchema = Yup.object().shape({
  room: roomSchemaWithUrl,
  venue: Yup.object().shape({
    iframeUrl: validUrlSchema,
  }),
});
