import React, { useCallback, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { useCopyToClipboard } from "react-use";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons";

import { DEFAULT_MAP_BACKGROUND } from "settings";

import { PosterPageVenue } from "types/venues";

import { WithId } from "utils/id";
import { getVenueFullLocation } from "utils/url";

import { LinkButton } from "components/atoms/LinkButton";

import {
  getTitleTextForSharing,
  getFacebookHref,
  getTwitterHref,
} from "./helpers";

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
  const url = getVenueFullLocation(venue.id);
  const [{ value: isShowCopiedText }, copyToClipboard] = useCopyToClipboard();

  const toCopy = useCallback(() => {
    copyToClipboard(url);
  }, [url, copyToClipboard]);

  const linkText = isShowCopiedText ? "Link Copied" : "Copy Link";

  const linkClasses = classNames("ShareModal__link", {
    "ShareModal__link--copied": isShowCopiedText,
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
      <LinkButton href={linkButton.href} key={linkButton.title}>
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
            src={venue.mapBackgroundImageUrl ?? DEFAULT_MAP_BACKGROUND}
            alt="map"
          />
          <div className="ShareModal__logo"></div>
          <h3 className="ShareModal__title">Room Title</h3>
          <span className="ShareModal__url-text">{url}</span>
        </div>

        <div className="ShareModal__content">
          <h3 className="ShareModal__content-title">Share this room</h3>
          {linkButtonsComponent}
          <div className={linkClasses} onClick={toCopy}>
            {linkText}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
