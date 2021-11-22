import * as Yup from "yup";

// an utility schema that can provide the most basic token validation while developing
export const emptyObjectSchema = Yup.object().shape({});
