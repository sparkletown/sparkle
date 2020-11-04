import { ChangeEvent } from "react";
import { FieldError } from "react-hook-form";

export interface ImageInputProps {
  onChange: (url: string) => void;
  name: string;
  customClass?: string;
  imageURL?: string;
  error?: FieldError;
  small?: boolean;
  forwardRef: any;
}
