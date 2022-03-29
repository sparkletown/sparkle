import * as Yup from "yup";

import { Banner } from "types/banner";

export const announcementSchema = Yup.object().shape<Banner>({
  content: Yup.string().required(),
  buttonDisplayText: Yup.string().required(),
  buttonUrl: Yup.string().required(),
  isActionButton: Yup.boolean().required(),
  isForceFunnel: Yup.boolean().required(),
  isFullScreen: Yup.boolean().required(),
});
