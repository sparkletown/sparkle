import React, { useCallback, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { useCopyToClipboard } from "react-use";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons";

import { PosterPageVenue } from "types/venues";

import { WithId } from "utils/id";
import { getFullVenueInsideUrl } from "utils/url";

import { LinkButton } from "components/atoms/LinkButton";

import {
  getTitleTextForSharing,
  getFacebookHref,
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
  const url = getFullVenueInsideUrl(venue.id);
  const [{ value: hasCopiedText }, copyToClipboard] = useCopyToClipboard();

  const copyThisUrl = useCallback(() => {
    copyToClipboard(url);
  }, [url, copyToClipboard]);

  const linkText = hasCopiedText ? "Link Copied" : "Copy Link";

  const linkClasses = classNames("ShareModal__link", {
    "ShareModal__link--copied": hasCopiedText,
  });

  const renderedLinkButtons = useMemo(() => {
    const textTitle = getTitleTextForSharing(venue, url);
    const facebookHref = getFacebookHref(url, textTitle);
    const twitterHref = getTwitterHref(textTitle);

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
    <Modal show={show} onHide={onHide}>
      <Modal.Body className="ShareModal">
        <div className="ShareModal__header">
          <img
            className="ShareModal__background"
            src={venue.config?.landingPageConfig?.coverImageUrl}
            alt="map"
          />
          <div className="ShareModal__logo" />
          <h3 className="ShareModal__title">{venue.parentId}</h3>
          <span className="ShareModal__url-text">{url}</span>
        </div>

        <div className="ShareModal__content">
          <h3 className="ShareModal__content-title">Share this page</h3>

          {renderedLinkButtons}

          <div className={linkClasses} onClick={copyThisUrl}>
            {linkText}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
