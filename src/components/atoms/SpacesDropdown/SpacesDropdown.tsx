import React, { useEffect, useMemo, useState } from "react";
import { Dropdown as ReactBootstrapDropdown } from "react-bootstrap";
import { FieldError, useForm } from "react-hook-form";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ADMIN_V1_ROOMS_BASE_URL, SPACE_PORTALS_ICONS_MAPPING } from "settings";

import { PortalTemplate } from "types/venues";

import { Dropdown } from "components/atoms/Dropdown";

import "./SpacesDropdown.scss";

export interface SpacesDropdownProps {
  defaultSpace?: string;
  venueSpaces: { template?: PortalTemplate; name: string }[];
  venueId?: string;
  setValue: <T>(prop: string, value: T, validate: boolean) => void;
  register: ReturnType<typeof useForm>["register"];
  fieldName: string;
  error?: FieldError;
}

export const SpacesDropdown: React.FC<SpacesDropdownProps> = ({
  defaultSpace,
  venueSpaces,
  venueId,
  setValue,
  register,
  fieldName,
  error,
}) => {
  const [spaceValue, setSpaceValue] = useState<string | undefined>(
    defaultSpace
  );

  useEffect(() => {
    if (defaultSpace) {
      setSpaceValue(defaultSpace);
    }
  }, [defaultSpace]);

  const spaceOptions = useMemo(() => {
    const options = venueSpaces.map((space) => {
      const spaceIcon = SPACE_PORTALS_ICONS_MAPPING[space.template ?? ""];
      return (
        <ReactBootstrapDropdown.Item
          key={space.name}
          onClick={() => {
            setSpaceValue(space.name);
            setValue(fieldName, space.name, true);
          }}
          className="SpacesDropdown__item"
        >
          <img
            alt={`space-icon-${spaceIcon}`}
            src={spaceIcon}
            className="SpacesDropdown__item-icon"
          />
          {space.name}
        </ReactBootstrapDropdown.Item>
      );
    });
    const createSpaceOption = (
      <ReactBootstrapDropdown.Item
        key="create-space"
        className="SpacesDropdown__item"
        href={`${ADMIN_V1_ROOMS_BASE_URL}/${venueId}`}
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

    const space = venueSpaces.find((space) => space.name === spaceValue);
    const spaceIcon = SPACE_PORTALS_ICONS_MAPPING[space?.template ?? ""];

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
    // @debt align the style of the SpacesDropdown with the Dropdown component
    <>
      <div className="SpacesDropdown">
        {renderSpaceValue}
        <Dropdown title="Select a space" options={spaceOptions} />
        <input type="hidden" ref={register} name={fieldName} />
      </div>
      {error && <span className="input-error">{error.message}</span>}
    </>
  );
};
