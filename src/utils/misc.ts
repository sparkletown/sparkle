import { GIF_RESIZER_URL } from "settings";

export const fileSizeLimitString = (limitMb: number) =>
  `File size limit is ${limitMb}MB. You can shrink images at ${GIF_RESIZER_URL}`;
