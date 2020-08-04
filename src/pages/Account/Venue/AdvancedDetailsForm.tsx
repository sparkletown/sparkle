import React from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { AdvancedVenueInput } from "api/admin";

interface AdvancedDetailsProps {
  register: ReturnType<typeof useForm>["register"];
  control: ReturnType<typeof useForm>["control"];
  values: Partial<AdvancedVenueInput>;
  errors: FieldErrors<Partial<AdvancedVenueInput>>;
}

export const AdvancedDetailsForm: React.FC<AdvancedDetailsProps> = (props) => {
  // const { register, values, errors } = props;
  return <div>Advanced Details</div>;
};
