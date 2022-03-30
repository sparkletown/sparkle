import React from "react";
import classNames from "classnames";

import { BoxDirectionProp, SizeProp } from "types/props";

import CN from "./Spacer.module.scss";

interface SpacerProps {
  marginSize?: SizeProp;
  marginDirection?: BoxDirectionProp;
  paddingSize?: SizeProp;
  paddingDirection?: BoxDirectionProp;
  element?: "div" | "section" | "span";
}

export const Spacer: React.FC<SpacerProps> = ({
  children,
  marginSize = "medium",
  marginDirection = "both",
  paddingSize = "medium",
  paddingDirection = "both",
  element = "div",
}) => {
  const className = classNames(
    CN[`margin-${marginSize}-${marginDirection}`],
    CN[`padding-${paddingSize}-${paddingDirection}`]
  );

  if (element === "div") {
    return (
      <div data-bem="Spacer" className={className}>
        {children}
      </div>
    );
  }

  if (element === "span") {
    return (
      <span data-bem="Spacer" className={className}>
        {children}
      </span>
    );
  }

  if (element === "section") {
    return (
      <section data-bem="Spacer" className={className}>
        {children}
      </section>
    );
  }

  return <>{children}</>;
};
