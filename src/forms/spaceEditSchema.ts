import * as Yup from "yup";

import { roomSchema } from "./roomSchema";
import { validUrlSchema } from "./validUrlSchema";

export const spaceEditSchema = Yup.object().shape({
  room: roomSchema,
  venue: Yup.object().shape({
    iframeUrl: validUrlSchema,
  }),
});
