import { ChangeEvent } from "react";
import { FieldError } from "react-hook-form";

export interface ImageInputProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  customClass?: string;
  imageURL?: string;
  error?: FieldError;
  small?: boolean;
  forwardRef: any;
}
