import { Link } from "react-router-dom";
import cn from "classnames";

type HeaderButtonVariant = "primary" | "secondary" | "multicolor";

const TW = {
  primary: "text-white bg-sparkle",
  secondary: "border-gray-300 bg-gray-50 text-gray-700 hover:bg-red-100",
  multicolor:
    "text-white bg-gradient-to-r from-sparkle-gradient-blue via-sparkle-gradient-purple to-sparkle-gradient-pink",
  general:
    "inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
};

interface HeaderButtonProps {
  name?: string;
  to?: string;
  icon?: (props: React.ComponentProps<"svg">) => JSX.Element;
  variant?: HeaderButtonVariant;
}
export const HeaderButton: React.FC<HeaderButtonProps> = ({
  to = "#",
  name = "Placeholder",
  // Alias icon to Icon so that jsx understands it is a component
  icon: Icon,
  variant = "primary",
}: HeaderButtonProps) => (
  <Link
    className={cn("HeaderButton", TW.general, TW[variant])}
    key={name}
    to={to}
  >
    {Icon && (
      <Icon
        className={cn("text-gray-500", "-ml-1 mr-2 h-5 w-5")}
        aria-hidden="true"
      />
    )}
    {name}
  </Link>
);
