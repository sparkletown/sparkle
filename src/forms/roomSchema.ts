import * as Yup from "yup";

import { ROOM_TAXON } from "settings";

import { createNameSchema } from "forms/factory/createNameSchema";

import { createUrlSchema } from "./factory/createUrlSchema";

export interface RoomSchemaShape {
  title: string;
  venueName?: string;
  url?: string;
  useUrl?: boolean;
  image_url: string;
}

export const roomSchema = ({
  required = false,
}: {
  required?: boolean;
} = {}) =>
  Yup.object().shape<RoomSchemaShape>({
    title: createNameSchema({ name: "Title", withMin: true }),
    image_url: Yup.string().required(`${ROOM_TAXON.capital} icon is required`),
    url: createUrlSchema({ required: required }),
  });
