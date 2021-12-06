import * as Yup from "yup";

import { roomSchema } from "./roomSchema";

export const nonIframeSpaceSchema = Yup.object().shape({
  room: roomSchema,
});
