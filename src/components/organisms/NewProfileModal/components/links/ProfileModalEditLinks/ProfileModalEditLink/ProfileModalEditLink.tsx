import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  useLinkIcon,
  useLinkUsername,
} from "components/organisms/NewProfileModal/components/links/links";
import { ProfileModalRoundIcon } from "components/organisms/NewProfileModal/components/ProfileModalRoundIcon/ProfileModalRoundIcon";
import { useBooleanState } from "hooks/useBooleanState";
import React, { Dispatch, SetStateAction, useState } from "react";
import "./ProfileModalEditLink.scss";
import { ProfileLink } from "types/User";
import { ContainerClassName } from "types/utility";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props extends ContainerClassName {
  link: ProfileLink;
}

export const useDisplayText = (
  initial: string,
  url: string,
  fieldTouched: boolean
): [string, Dispatch<SetStateAction<string>>] => {
  const [display, setDisplay] = useState(initial);

  const username = useLinkUsername(url);
  if (!fieldTouched && username) {
    if (username !== display) setDisplay(username);
    return [username, setDisplay];
  } else {
    return [display, setDisplay];
  }
};

export const ProfileModalEditLink: React.FC<Props> = ({
  link,
  containerClassName,
}: Props) => {
  const [url, setUrl] = useState(link.url);
  const linkIcon = useLinkIcon(url);
  const [displayTextTouched, touchDisplayText] = useBooleanState(
    link.title !== ""
  );

  const [displayText, setDisplayText] = useDisplayText(
    link.title,
    url,
    displayTextTouched
  );

  return (
    <div className={classNames("ProfileModalEditLink", containerClassName)}>
      <div className="ProfileModalEditLink__url">
        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="ProfileModalEditLink__input"
        />
      </div>
      <div className="ProfileModalEditLink__text">
        <input
          value={displayText}
          onChange={(e) => setDisplayText(e.target.value)}
          placeholder="Display Text"
          className="ProfileModalEditLink__input"
          onFocus={touchDisplayText}
        />
        <FontAwesomeIcon
          icon={linkIcon}
          className="ProfileModalEditLink__text-icon"
        />
      </div>
      <ProfileModalRoundIcon
        containerClassName="ProfileModalEditLink__delete-icon"
        icon={faTrash}
      />
    </div>
  );
};
