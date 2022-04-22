import React, { ReactNode } from "react";
import classNames from "classnames";

import { InputGroupSubtitle } from "./InputGroupSubtitle";
import { InputGroupTitle } from "./InputGroupTitle";

type MarginVariant = "regular" | "subgroup";

export interface InputGroupProps {
  title?: ReactNode | string;
  subtitle?: ReactNode | string;
  withLabel?: boolean;
  isRequired?: boolean;
  isOptional?: boolean;
  margin?: MarginVariant;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  title,
  subtitle,
  withLabel = false,
  isRequired,
  isOptional,
  children,
  margin = "regular",
}) => {
  const required = isRequired ? "required" : isOptional ? "optional" : "none";

  const contents = (
    <>
      {title && <InputGroupTitle required={required}>{title}</InputGroupTitle>}
      {subtitle && <InputGroupSubtitle>{subtitle}</InputGroupSubtitle>}
    </>
  );

  const sectionClasses = classNames("mt-6 flow-root", {
    "mt-4 ml-14 pl-1": margin === "subgroup",
  });

  return (
    <section data-bem="InputGroup" className={sectionClasses}>
      {withLabel ? <label>{contents}</label> : contents}
      {children}
    </section>
  );
};
