import React, { ReactNode } from "react";

import { InputGroupSubtitle } from "./InputGroupSubtitle";
import { InputGroupTitle } from "./InputGroupTitle";

export interface InputGroupProps {
  title?: ReactNode | string;
  subtitle?: ReactNode | string;
  withLabel?: boolean;
  isRequired?: boolean;
  isOptional?: boolean;
  ml?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  title,
  subtitle,
  withLabel = false,
  isRequired,
  isOptional,
  children,
  ml,
}) => {
  const required = isRequired ? "required" : isOptional ? "optional" : "none";

  const contents = (
    <>
      {title && <InputGroupTitle required={required}>{title}</InputGroupTitle>}
      {subtitle && <InputGroupSubtitle>{subtitle}</InputGroupSubtitle>}
    </>
  );

  return (
    <section className={`mb-6 mt-6 flow-root ${ml && `ml-${ml}`}`}>
      {withLabel ? <label>{contents}</label> : contents}
      {children}
    </section>
  );
};
