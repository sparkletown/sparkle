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

/**
 * This is an experimental component used in the old login flow.
 * It will eventually be removed along with it.
 *
 * Its interface, on the other hand, may be re-used
 * for the more generic components
 * such as Button, Input etc.
 * to make layout easier and more uniform.
 */
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
