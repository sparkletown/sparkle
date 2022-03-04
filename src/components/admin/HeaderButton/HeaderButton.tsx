import { Link } from "react-router-dom";
import cn from "classnames";

import {
  DEFAULT_MISSING_PARAM_URL,
  DEFAULT_MISSING_PLACEHOLDER,
} from "settings";

import * as TW from "./HeaderButton.tailwind";

type HeaderButtonVariant = "primary" | "secondary" | "multicolor";

export interface HeaderButtonProps {
  name?: string;
  to?: string;
  icon?: (props: React.ComponentProps<"svg">) => JSX.Element;
  variant?: HeaderButtonVariant;
  onClick?: () => void;
}
export const HeaderButton: React.FC<HeaderButtonProps> = ({
  to = DEFAULT_MISSING_PARAM_URL,
  name = DEFAULT_MISSING_PLACEHOLDER,
  // Alias icon to Icon so that jsx understands it is a component
  icon: Icon,
  variant = "primary",
  onClick,
}) => (
  <Link
    className={cn("HeaderButton", TW.general, TW[variant])}
    key={name}
    to={to}
    onClick={onClick}
  >
    {Icon && (
      <Icon className="text-gray-500 -ml-1 mr-2 h-5 w-5" aria-hidden="true" />
    )}
    {name}
  </Link>
);
