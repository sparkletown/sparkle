import React, { useMemo, useState } from "react";
import { Dropdown as ReactBootstrapDropdown } from "react-bootstrap";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { ADMIN_V1_ROOMS_URL, VENUE_SPACES_ICONS_MAPPING } from "settings";

import { Room } from "types/rooms";
import { ContainerClassName } from "types/utility";

import { Dropdown } from "components/atoms/Dropdown";

import "./SpacesDropdown.scss";

export interface SpacesDropdownProps extends ContainerClassName {
  defaultSpace?: string;
  venueSpaces: Room[];
  venueId?: string;
  setValue: <T>(prop: string, value: T, validate: boolean) => void;
  fieldName: string;
}

export const SpacesDropdown: React.FC<SpacesDropdownProps> = ({
  defaultSpace,
  venueSpaces,
  venueId,
  containerClassName,
  setValue,
  fieldName,
}) => {
  const [spaceValue, setSpaceValue] = useState<string | undefined>(
    defaultSpace
  );

  const spaceOptions = useMemo(() => {
    const options = venueSpaces.map((space) => {
      const spaceIcon = VENUE_SPACES_ICONS_MAPPING[space.template ?? ""];
      return (
        <ReactBootstrapDropdown.Item
          key={space.title}
          onClick={() => {
            setSpaceValue(space.title);
            setValue(fieldName, space.title, true);
          }}
          className="SpacesDropdown__item"
        >
          <img
            alt={`space-icon-${spaceIcon}`}
            src={spaceIcon}
            className="SpacesDropdown__item-icon"
          />
          {space.title}
        </ReactBootstrapDropdown.Item>
      );
    });
    const createSpaceOption = (
      <ReactBootstrapDropdown.Item
        key="create-space"
        className="SpacesDropdown__item"
        href={`${ADMIN_V1_ROOMS_URL}/${venueId}`}
      >
        <FontAwesomeIcon
          className="SpacesDropdown__item-icon"
          icon={faPlus}
          size="sm"
        />
        Create a new space
      </ReactBootstrapDropdown.Item>
    );

    return [...options, createSpaceOption];
  }, [venueSpaces, setValue, fieldName, venueId]);

  const renderSpaceValue = useMemo(() => {
    if (!spaceValue) return;

    const space = venueSpaces.find((space) => space.title === spaceValue);
    const spaceIcon = VENUE_SPACES_ICONS_MAPPING[space?.template ?? ""];

    return (
      <span className="SpacesDropdown__value">
        <img
          alt={`space-icon-${spaceIcon}`}
          src={spaceIcon}
          className="SpacesDropdown__item-icon"
        />
        {spaceValue}
      </span>
    );
  }, [venueSpaces, spaceValue]);

  return (
    <div className={classNames("SpacesDropdown", containerClassName)}>
      {renderSpaceValue}
      <Dropdown title="Select a space" options={spaceOptions} />
    </div>
  );
};
