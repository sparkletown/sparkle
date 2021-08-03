import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import {
  getLinkUsername,
  useLinkIcon,
} from "components/organisms/NewProfileModal/components/links/links";
import { ProfileModalRoundIcon } from "components/organisms/NewProfileModal/components/ProfileModalRoundIcon/ProfileModalRoundIcon";
import { formProp } from "components/organisms/NewProfileModal/UserProfileModal";
import { useBooleanState } from "hooks/useBooleanState";
import React, { useCallback, useEffect } from "react";
import { FormFieldProps } from "types/forms";
import { ProfileLink } from "types/User";
import { ContainerClassName } from "types/utility";
import "./ProfileModalEditLink.scss";

interface Props extends ContainerClassName {
  index: number;
  initialLink: ProfileLink;
  link: ProfileLink;
  setTitle: (title: string) => void;
  register: FormFieldProps["register"];
}

export const ProfileModalEditLink: React.FC<Props> = ({
  index,
  initialLink,
  link,
  setTitle,
  register,
  containerClassName,
}: Props) => {
  const linkIcon = useLinkIcon(link.url);

  const getInputNameForForm = useCallback(
    (index: number, prop: keyof ProfileLink) =>
      `${formProp("links")}[${index}].${prop}`,
    []
  );

  const [titleTouched, setTitleTouched] = useBooleanState(
    initialLink.title !== ""
  );

  useEffect(() => {
    const username = getLinkUsername(link.url);
    if (!titleTouched && username)
      if (username !== link.title) setTitle(username);
  }, [link.title, link.url, setTitle, titleTouched]);

  return (
    <div className={classNames("ProfileModalEditLink", containerClassName)}>
      <div className="ProfileModalEditLink__url">
        <input
          name={getInputNameForForm(index, "url")}
          placeholder="URL"
          defaultValue={initialLink.url}
          className="ProfileModalEditLink__input"
          ref={register()}
        />
      </div>
      <div className="ProfileModalEditLink__text">
        <input
          name={getInputNameForForm(index, "title")}
          onFocus={setTitleTouched}
          defaultValue={initialLink.title}
          placeholder="Display Text"
          className="ProfileModalEditLink__input"
          ref={register()}
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
