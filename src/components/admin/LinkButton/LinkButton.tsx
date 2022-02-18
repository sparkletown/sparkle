import { CSSProperties } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import * as TW from "./LinkButton.tailwind";

type LinkButtonWidth = "natural" | "halfContainer";

interface LinkButtonProps {
  style?: CSSProperties;
  href: string;
  disabled?: boolean;
  width?: LinkButtonWidth;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  style,
  href,
  disabled = false,
  width = "natural",
}) => (
  <Link
    to={disabled ? "#" : href}
    style={style}
    className={classNames(TW.general, TW[width])}
  >
    {children}
  </Link>
);
