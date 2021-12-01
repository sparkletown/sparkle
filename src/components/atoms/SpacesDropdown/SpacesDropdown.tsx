import React, { useEffect, useMemo, useState } from "react";
import { Dropdown as ReactBootstrapDropdown } from "react-bootstrap";
import { FieldError, useForm } from "react-hook-form";
import { omit } from "lodash";

import { SPACE_PORTALS_ICONS_MAPPING } from "settings";

import { Room } from "types/rooms";
import { AnyVenue, PortalTemplate, VenueTemplate } from "types/venues";

import { WithId } from "utils/id";

import { Dropdown } from "components/atoms/Dropdown";

import "./SpacesDropdown.scss";

const noneOptionName = "None";
const spaceNoneOption = Object.freeze({
  none: Object.freeze({ name: "", template: undefined }),
});

export type SpacesDropdownPortal = { template?: PortalTemplate; name: string };
export interface DropdownRoom extends Room {
  name: string;
}
export interface SpacesDropdownProps {
  parentSpace?: SpacesDropdownPortal;
  setValue: <T>(prop: string, value: T, validate: boolean) => void;
  register: ReturnType<typeof useForm>["register"];
  fieldName: string;
  error?: FieldError;
  portals: Record<string, WithId<AnyVenue> | DropdownRoom>;
}

export const SpacesDropdown: React.FC<SpacesDropdownProps> = ({
  parentSpace,
  portals,
  setValue,
  register,
  fieldName,
  error,
}) => {
  const [selected, setSelected] = useState(parentSpace);

  // @debt: Probably need to omit returning playa from the useOwnedVenues as it's deprecated and
  // doesn't exist on SPACE_PORTALS_ICONS_MAPPING
  const filteredPortals = omit(portals, VenueTemplate.playa);

  const portalOptions = useMemo(
    () => ({ ...spaceNoneOption, ...filteredPortals }),
    [filteredPortals]
  );

  useEffect(() => {
    if (parentSpace) {
      setSelected(parentSpace);
    }
  }, [parentSpace]);

  const renderedOptions = useMemo(
    () =>
      Object.values(portalOptions).map(({ name, template }) => {
        const spaceIcon = SPACE_PORTALS_ICONS_MAPPING[template ?? ""];

        return (
          <ReactBootstrapDropdown.Item
            key={name}
            onClick={() => {
              setSelected({ name, template });
              setValue(fieldName, name, true);
            }}
            className="SpacesDropdown__item"
          >
            {name !== spaceNoneOption.none.name ? (
              <img
                alt={`space-icon-${spaceIcon}`}
                src={spaceIcon}
                className="SpacesDropdown__item-icon"
              />
            ) : null}
            {name || noneOptionName}
          </ReactBootstrapDropdown.Item>
        );
      }) ?? [],
    [portalOptions, setValue, fieldName]
  );

  const renderedTitle = useMemo(() => {
    if (!selected) {
      return "Select a space";
    }

    const space = portals?.[selected.name] ?? parentSpace;

    const spaceIcon = SPACE_PORTALS_ICONS_MAPPING[space?.template ?? ""];

    return (
      <span className="SpacesDropdown__value">
        {selected.name !== spaceNoneOption.none.name ? (
          <img
            alt={`space-icon-${spaceIcon}`}
            src={spaceIcon}
            className="SpacesDropdown__item-icon"
          />
        ) : null}
        {selected.name || noneOptionName}
      </span>
    );
  }, [portals, selected, parentSpace]);

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
