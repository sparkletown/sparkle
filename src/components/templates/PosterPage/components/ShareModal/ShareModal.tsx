import React, { useCallback, useMemo } from "react";
import ReactModal from "react-modal";
import { useCopyToClipboard } from "react-use";
import { faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { PosterPageVenue } from "types/venues";

import { WithId } from "utils/id";
import { generateAttendeeInsideUrl } from "utils/url";

import { useWorldParams } from "hooks/worlds/useWorldParams";

import { LinkButton } from "components/atoms/LinkButton";

import {
  getFacebookHref,
  getTitleTextForSharing,
  getTwitterHref,
} from "./utils";

import "./ShareModal.scss";

export interface ShareModalProps {
  show: boolean;
  onHide: () => void;
  venue: WithId<PosterPageVenue>;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  show,
  onHide,
  venue,
}) => {
  const { worldSlug } = useWorldParams();
  const url = generateAttendeeInsideUrl({
    worldSlug,
    spaceSlug: venue.slug,
    absoluteUrl: true,
  });
  const [{ value: hasCopiedText }, copyToClipboard] = useCopyToClipboard();

  const copyThisUrl = useCallback(() => {
    copyToClipboard(url);
  }, [url, copyToClipboard]);

  const linkText = hasCopiedText ? "Link Copied" : "Copy Link";

  const linkClasses = classNames("ShareModal__link", {
    "ShareModal__link--copied": hasCopiedText,
  });

  const renderedLinkButtons = useMemo(() => {
    const textTitle = getTitleTextForSharing({ venue, url });
    const facebookHref = getFacebookHref(venue, url, textTitle);
    const twitterHref = getTwitterHref(venue, textTitle);

    const linkButtons = [
      {
        href: facebookHref,
        icon: faFacebook,
        title: "Facebook",
      },
      {
        href: twitterHref,
        icon: faTwitter,
        title: "Twitter",
      },
    ];

    return linkButtons.map((linkButton) => (
      <LinkButton key={linkButton.title} href={linkButton.href}>
        <FontAwesomeIcon icon={linkButton.icon} />
        <span className="ShareModal__button-text">{linkButton.title}</span>
      </LinkButton>
    ));
  }, [url, venue]);

  return (
    <ReactModal isOpen={show} onAfterClose={onHide}>
      <div className="ShareModal">
        <div className="ShareModal__header">
          <h3 className="ShareModal__title">
            {venue.poster?.title ?? "Poster"}
          </h3>
          <span className="ShareModal__url-text">{url}</span>
        </div>

        <div className="ShareModal__content">
          <h3 className="ShareModal__content-title">Share this page</h3>

          {renderedLinkButtons}

          <div className={linkClasses} onClick={copyThisUrl}>
            {linkText}
          </div>
        </div>
      </div>
    </ReactModal>
  );
};
