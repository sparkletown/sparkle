import React from "react";
import { Link } from "react-router-dom";
import ShowMoreText from "react-show-more-text";
import { faExternalLinkAlt, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import {
  ADMIN_IA_SPACE_EDIT_PARAM_URL,
  ATTENDEE_INSIDE_URL,
  DEFAULT_SHOW_MORE_SETTINGS,
  DEFAULT_VENUE_LOGO,
  SPACE_CARD_HEADER_BACKGROUND,
  SPACE_INFO_MAP,
} from "settings";

import { SpaceWithId, WorldWithId } from "types/id";

import { isDefaultPortalIcon } from "utils/image";
import { generateUrl } from "utils/url";

import { useWorldEvents } from "hooks/events";

import { LinkButton } from "./LinkButton";

const cardHeaderStyles = {
  background: `url(${SPACE_CARD_HEADER_BACKGROUND})`,
};

interface SpaceCardProps {
  space: SpaceWithId;
  world: WorldWithId;
  isEditable?: boolean;
}

export const SpaceCard: React.FC<SpaceCardProps> = ({
  space,
  world,
  isEditable,
}) => {
  const spaceDescription =
    space.config?.landingPageConfig?.description ||
    "Description can be changed in space settings";

  const spaceTemplate = SPACE_INFO_MAP[space.template]?.text;

  const visitSpaceUrl = generateUrl({
    route: ATTENDEE_INSIDE_URL,
    required: ["worldSlug", "spaceSlug"],
    params: { worldSlug: world.slug, spaceSlug: space.slug },
  });

  const editSpaceUrl = generateUrl({
    route: ADMIN_IA_SPACE_EDIT_PARAM_URL,
    required: ["worldSlug", "spaceSlug"],
    params: { worldSlug: world.slug, spaceSlug: space.slug },
  });

  const { events: experiences } = useWorldEvents({ worldId: world.id });

  const spaceExperiences = experiences?.filter(
    (exp) => exp.spaceId === space.id
  );

  const spaceLogoSrc = space.host?.icon || DEFAULT_VENUE_LOGO;
  const spaceIconClasses = classNames("w-16 h-16 rounded-full", {
    "bg-gray-800": isDefaultPortalIcon(spaceLogoSrc),
  });

  return (
    <li className="flex flex-col bg-white rounded-lg shadow">
      <div
        className="flex flex-col bg-contain bg-center rounded-t-lg px-4 py-4"
        style={cardHeaderStyles}
      >
        <div className="flex flex-row justify-end">
          <Link
            to={visitSpaceUrl}
            className="mt-2 flex items-center text-sm text-white"
          >
            <FontAwesomeIcon
              className="SpaceCard__link-icon"
              icon={faExternalLinkAlt}
            />
            Visit
          </Link>
        </div>
      </div>

      <div className="flex flex-row justify-start items-center pt-2 px-4">
        <img className={spaceIconClasses} src={spaceLogoSrc} alt="space logo" />
        <div className="flex flex-col w-full ml-3">
          <h3 className="text-black text-md font-medium">
            <ShowMoreText
              lines={2}
              className="SpaceCard__space-name"
              {...DEFAULT_SHOW_MORE_SETTINGS}
            >
              {space.name}
            </ShowMoreText>
          </h3>
          <p className="text-gray-900 text-sm">{spaceTemplate}</p>
        </div>
      </div>
      <div className="flex flex-col py-4 px-4">
        <div className="pt-2 pb-2 mb-3 min-h-[124px] border px-2 rounded-md border-gray-100 bg-gray-50">
          <span className="text-gray-900 text-sm">
            <ShowMoreText
              lines={5}
              className="SpaceCard__space-description"
              {...DEFAULT_SHOW_MORE_SETTINGS}
            >
              {spaceDescription}
            </ShowMoreText>
          </span>
        </div>
        <div>
          <p className="text-gray-900 text-sm pb-2">
            <span className="font-medium">{spaceExperiences?.length || 0}</span>{" "}
            experiences
          </p>
        </div>
        <div className="flex flex-row justify-start">
          <p className="flex text-gray-900 text-sm align-center">
            <FontAwesomeIcon
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-900"
              aria-hidden="true"
              icon={faUsers}
            />
            <span className="font-medium mr-1">
              {space.recentUserCount ?? 0}
            </span>{" "}
            people online
          </p>
        </div>
        <div className="flex justify-center align-center mt-4">
          <LinkButton
            href={editSpaceUrl}
            disabled={!isEditable}
            width="halfContainer"
          >
            Edit
          </LinkButton>
        </div>
      </div>
    </li>
  );
};
