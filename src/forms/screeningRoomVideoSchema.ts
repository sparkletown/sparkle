import * as Yup from "yup";

import { ScreeningRoomVideo } from "types/screeningRoom";

import { createNameSchema } from "forms/factory/createNameSchema";

type RoomSchemaShape = Omit<ScreeningRoomVideo, "thumbnailSrc"> & {
  thumbnailSrcUrl: string;
};

export const screeningRoomVideoSchema = Yup.object().shape<RoomSchemaShape>({
  title: createNameSchema({ name: "Title", withMin: true }),
  category: Yup.string().required("Category is required"),
  authorName: Yup.string().required("Author is required"),
  thumbnailSrcUrl: Yup.string().required("Thumbnail is required"),
  videoSrc: Yup.string().required("Video is required"),
  introduction: Yup.string().notRequired(),
});
