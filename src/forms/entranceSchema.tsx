import * as Yup from "yup";

export const entranceSchema = Yup.array(
  Yup.object().shape({
    videoUrl: Yup.string().required("Video URL is required."),
    autoplay: Yup.boolean().notRequired(),
    buttons: Yup.array(
      Yup.object().shape({
        isProceed: Yup.boolean().required(),
        text: Yup.string().notRequired(),
        href: Yup.string().notRequired(),
      })
    ),
  })
);
