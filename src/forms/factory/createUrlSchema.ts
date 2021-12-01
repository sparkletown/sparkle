import { roomUrlSchema } from "forms/roomUrlSchema";

export interface CreateUrlSchemaOptions {
  name: string;
  required?: boolean;
}

export const createUrlSchema = ({ name, required }: CreateUrlSchemaOptions) => {
  let schema = roomUrlSchema;

  if (required) {
    schema = schema.required(`${name} is required`);
  }

  return schema;
};
