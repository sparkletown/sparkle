import React, { useEffect, useMemo, useState } from "react";
import { Dropdown as ReactBootstrapDropdown } from "react-bootstrap";
import { FieldError, useForm } from "react-hook-form";

import { SPACE_PORTALS_ICONS_MAPPING } from "settings";

import { PortalTemplate } from "types/venues";

import { Dropdown } from "components/atoms/Dropdown";

import "./SpacesDropdown.scss";

export interface SpacesDropdownProps {
  defaultSpace?: string;
  venueId?: string;
  setValue: <T>(prop: string, value: T, validate: boolean) => void;
  register: ReturnType<typeof useForm>["register"];
  fieldName: string;
  error?: FieldError;
  venueSpaces: { template?: PortalTemplate; name: string }[];
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

  const renderedOptions = useMemo(() => {
    const options = venueSpaces.map(({ name, template }) => {
      const spaceIcon = SPACE_PORTALS_ICONS_MAPPING[template ?? ""];
      return (
        <ReactBootstrapDropdown.Item
          key={name}
          onClick={() => {
            setSpaceValue(name);
            setValue(fieldName, name, true);
          }}
          className="SpacesDropdown__item"
        >
          <img
            alt={`space-icon-${spaceIcon}`}
            src={spaceIcon}
            className="SpacesDropdown__item-icon"
          />
          {name}
        </ReactBootstrapDropdown.Item>
      );
    });

    return options;
  }, [venueSpaces, setValue, fieldName]);

  const renderedTitle = useMemo(() => {
    if (!spaceValue) {
      return "Select a space";
    }

    const space = venueSpaces.find(({ name }) => name === spaceValue);
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
        <Dropdown title={renderedTitle} options={renderedOptions} />
        <input type="hidden" ref={register} name={fieldName} />
      </div>
      {error && <span className="input-error">{error.message}</span>}
    </>
  );
};
