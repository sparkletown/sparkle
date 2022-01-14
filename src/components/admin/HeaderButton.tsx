import { Link } from "react-router-dom";
import classNames from "classnames";

interface HeaderButtonProps {
  extraClasses?: string;
  name?: string;
  to?: string;
  icon?: (props: React.ComponentProps<"svg">) => JSX.Element;
  iconExtraClasses?: string;
}
export const HeaderButton = ({
  extraClasses = "border-gray-300 bg-gray-50 text-gray-700 hover:bg-red-100",
  to = "#",
  name = "Placeholder",
  icon = undefined,
  iconExtraClasses = "text-gray-500",
}: HeaderButtonProps) => {
  // Alias icon to Icon so that jsx understands it is a component
  const Icon = icon;
  return (
    <Link
      className={classNames(
        extraClasses,
        "inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      )}
      key={name}
      to={to}
    >
      {Icon && (
        <Icon
          className={classNames(iconExtraClasses, "-ml-1 mr-2 h-5 w-5")}
          aria-hidden="true"
        />
      )}
      {name}
    </Link>
  );
};
