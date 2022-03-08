import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/solid";
import { TablePanel } from "components/admin/TablePanel";
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
    <TablePanel.Row>
      <TablePanel.Cell>
        <TableRowAvatar src={world.host?.icon || DEFAULT_VENUE_LOGO} />
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{world.name}</div>
          <div className="text-sm text-gray-900">
            {world.config?.landingPageConfig?.description}
          </div>
        </div>
      </TablePanel.Cell>
      <TablePanel.ActionsCell>
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
      </TablePanel.ActionsCell>
    </TablePanel.Row>
  );
};
