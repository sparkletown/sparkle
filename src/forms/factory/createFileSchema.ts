import * as Yup from "yup";

export type CreateFileSchemaOptions = {
  name: string;
  required: boolean;
};

export const createFileSchema = ({ name, required }: CreateFileSchemaOptions) =>
  Yup.mixed<FileList>().test(
    name,
    "Image required",
    (val: FileList) => !required || val.length > 0
  );
