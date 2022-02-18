import React, { ReactNode } from "react";

import { FormSectionSubtitle } from "./FormSectionSubtitle";
import { FormSectionTitle } from "./FormSectionTitle";

export interface FormSectionProps {
  title?: ReactNode | string;
  subtitle?: ReactNode | string;
  withLabel?: boolean;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  subtitle,
  withLabel = false,
  children,
}) => {
  const contents = (
    <>
      {title && <FormSectionTitle>{title}</FormSectionTitle>}
      {subtitle && <FormSectionSubtitle>{subtitle}</FormSectionSubtitle>}
      {children}
    </>
  );

  return (
    <section className="mb-6 mt-6 flow-root">
      {withLabel ? <label>{contents}</label> : contents}
    </section>
  );
};
