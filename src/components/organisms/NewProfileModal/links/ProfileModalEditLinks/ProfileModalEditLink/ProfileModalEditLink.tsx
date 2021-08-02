import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { ProfileModalRoundIcon } from "components/organisms/NewProfileModal/ProfileModalRoundIcon/ProfileModalRoundIcon";
import React from "react";
import "./ProfileModalEditLink.scss";
import { ProfileLink } from "types/User";
import { ContainerClassName } from "types/utility";
import classNames from "classnames";

interface Props extends ContainerClassName {
  link: ProfileLink;
}

export const ProfileModalEditLink: React.FC<Props> = ({
  link,
  containerClassName,
}: Props) => {
  return (
    <div className={classNames("ProfileModalEditLink", containerClassName)}>
      <div className="ProfileModalEditLink__url">
        <input
          placeholder="link url"
          className="ProfileModal__input ProfileModal__input--condensed"
        />
      </div>
      <div className="ProfileModalEditLink__text">
        <input
          placeholder="display text"
          className="ProfileModal__input ProfileModal__input--condensed"
        />
      </div>
      <ProfileModalRoundIcon
        containerClassName="ProfileModalEditLink__delete-icon"
        icon={faTrash}
      />
    </div>
  );
};
