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

const roomImageUrlSchema = Yup.string().required(
  `${ROOM_TAXON.capital} icon is required`
);

export const roomSchema = ({
  urlRequired = false,
}: {
  urlRequired?: boolean;
}) =>
  Yup.object().shape<RoomSchemaShape>({
    title: createNameSchema({ name: "Title", withMin: true }),
    image_url: roomImageUrlSchema,
    url: createUrlSchema({ name: "Url", required: urlRequired }),
  });
