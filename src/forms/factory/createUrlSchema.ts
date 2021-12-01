import { roomUrlSchema } from "forms/roomUrlSchema";

export interface CreateUrlSchemaOptions {
  required?: boolean;
}

export const createUrlSchema = ({ required }: CreateUrlSchemaOptions) => {
  let schema = undefined;

  if (required) {
    schema = roomUrlSchema;
  }

  return schema;
};
