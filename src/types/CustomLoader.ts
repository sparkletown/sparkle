import * as Yup from "yup";

export type CustomLoader = {
  url: string;
  text: string;
  title: string;
};

export const CustomLoaderSchema = Yup.object().shape<CustomLoader>({
  url: Yup.string().required(),
  text: Yup.string().required(),
  title: Yup.string().required(),
});

export const isCustomLoader = (data: {}): data is CustomLoader =>
  CustomLoaderSchema.isValidSync(data);
