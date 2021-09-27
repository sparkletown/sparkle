import React, { useMemo, useState } from "react";
import { Dropdown as ReactBootstrapDropdown } from "react-bootstrap";
import classNames from "classnames";

import { Room } from "types/rooms";
import { ContainerClassName } from "types/utility";

import { venueSpacesList } from "utils/room";

import { Dropdown } from "components/atoms/Dropdown";

import "./SpacesDropdown.scss";

export interface SpacesDropdownProps extends ContainerClassName {
  defaultSpace: string;
  venueSpaces: Room[];
  setValue: <T>(prop: string, value: T, validate: boolean) => void;
  fieldName: string;
}

export const SpacesDropdown: React.FC<SpacesDropdownProps> = ({
  defaultSpace,
  venueSpaces,
  containerClassName,
  setValue,
  fieldName,
}) => {
  const [spaceValue, setSpaceValue] = useState<string>(defaultSpace);

  const spaceOptions = useMemo(
    () =>
      venueSpaces.map((space) => {
        const venueSpaceIcon = venueSpacesList.find(
          (venueSpace) => venueSpace.template === space.template
        )?.icon;

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
              alt={`space-icon-${venueSpaceIcon}`}
              src={venueSpaceIcon}
              className="SpacesDropdown__item-icon"
            />
            {space.title}
          </ReactBootstrapDropdown.Item>
        );
      }),
    [venueSpaces, setValue, fieldName]
  );

  const renderSpaceValue = useMemo(() => {
    const space = venueSpaces.find((space) => space.title === spaceValue);
    const venueSpaceIcon = venueSpacesList.find(
      (venueSpace) => venueSpace.template === space?.template
    )?.icon;

    return (
      <span className="SpacesDropdown__value">
        <img
          alt={`space-icon-${venueSpaceIcon}`}
          src={venueSpaceIcon}
          className="SpacesDropdown__item-icon"
        />
        {spaceValue}
      </span>
    );
  }, [venueSpaces, spaceValue]);

  return (
    <div className={classNames("SpacesDropdown", containerClassName)}>
      {renderSpaceValue}
      <Dropdown
        id={fieldName}
        title="Select a space"
        options={spaceOptions}
        containerClassName="SpacesDropdown__container"
      />
    </div>
  );
};
