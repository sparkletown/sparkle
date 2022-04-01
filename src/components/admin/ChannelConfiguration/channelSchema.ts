import * as Yup from "yup";

import { createNameSchema } from "forms/factory/createNameSchema";

interface ChannelSchemaShape {
  name: string;
  iframeUrl: string;
}

export const channelSchema = Yup.object().shape<ChannelSchemaShape>({
  name: createNameSchema({ name: "Name", withMin: true }),
  iframeUrl: Yup.string().required(`URL is required`),
});
