import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/solid";
import { TableRowAvatar } from "components/admin/TableRowAvatar";

import { ADMIN_IA_WORLD_PARAM_URL, DEFAULT_VENUE_LOGO } from "settings";

import { World } from "api/world";

import { WithId } from "utils/id";
import { generateUrl } from "utils/url";

interface WorldCardProps {
  world: WithId<World>;
}

export const WorldCard: React.FC<WorldCardProps> = ({ world }) => {
  // TODO-redesign
  // Probably want to include these variables in this component:
  // - world.config?.landingPageConfig?.coverImageUrl
  // - world.host?.icon ?? DEFAULT_VENUE_LOGO
  const url = generateUrl({
    route: ADMIN_IA_WORLD_PARAM_URL,
    required: ["worldSlug"],
    params: { worldSlug: world.slug },
  });

  return (
    <tr>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <TableRowAvatar src={world.host?.icon || DEFAULT_VENUE_LOGO} />
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {world.name}
            </div>
            <div className="text-sm text-gray-900">
              {world.config?.landingPageConfig?.description}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex align-center justify-end gap-x-5 flex-row">
          <div className="flex align-center items-center">
            <Link
              to={url}
              className="flex align-center items-center text-gray-900 hover:text-indigo-900"
            >
              <ArrowRightIcon
                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-900 hover:text-indigo-900"
                aria-hidden="true"
              ></ArrowRightIcon>
              Go to world
            </Link>
          </div>
        </div>
      </td>
    </tr>
  );
};
