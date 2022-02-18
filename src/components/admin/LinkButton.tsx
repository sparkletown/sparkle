import { CSSProperties } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

interface LinkButtonProps {
  style?: CSSProperties;
  href: string;
  disabled?: boolean;
  width?: string;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  style,
  href,
  disabled = false,
  width,
}) => (
  <Link
    to={disabled ? "#" : href}
    style={style}
    className={classNames(
      "h-10 text-center px-3.5 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-sparkle hover:bg-sparkle-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
      {
        [`w-${width}`]: width,
      }
    )}
  >
    {children}
  </Link>
);
