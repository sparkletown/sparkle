import * as Yup from "yup";

import { roomSchema } from "./roomSchema";
import { validUrlSchema } from "./validUrlSchema";

export const externalSpaceEditSchema = Yup.object().shape({
  room: roomSchema({ urlRequired: true }),
  venue: Yup.object().shape({
    iframeUrl: validUrlSchema,
  }),
});
