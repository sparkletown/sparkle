import React, { useEffect, useMemo, useState } from "react";
import { Dropdown as ReactBootstrapDropdown } from "react-bootstrap";
import { FieldError, useForm } from "react-hook-form";
import { omit } from "lodash";

import { PORTAL_INFO_ICON_MAPPING } from "settings";

import { Room } from "types/rooms";
import { AnyVenue, PortalTemplate, VenueTemplate } from "types/venues";

import { WithId } from "utils/id";

import { Dropdown } from "components/atoms/Dropdown";

import "./SpacesDropdown.scss";

const noneOptionName = "None";
const spaceNoneOption = Object.freeze({
  none: Object.freeze({ slug: "", template: undefined }),
});

export type SpacesDropdownPortal = { template?: PortalTemplate; slug: string };
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

  // @debt: Probably need to omit returning playa from the useOwnedVenues as it's deprecated and doesn't exist on PORTAL_INFO_ICON_MAPPING
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
      Object.values(portalOptions).map(({ slug, template }) => {
        const spaceIcon = PORTAL_INFO_ICON_MAPPING[template ?? ""];

        return (
          <ReactBootstrapDropdown.Item
            key={slug}
            onClick={() => {
              setSelected({ slug, template });
              setValue(fieldName, slug, true);
            }}
            className="SpacesDropdown__item"
          >
            {slug !== spaceNoneOption.none.slug ? (
              <img
                alt={`space-icon-${spaceIcon}`}
                src={spaceIcon}
                className="SpacesDropdown__item-icon"
              />
            ) : null}
            {slug || noneOptionName}
          </ReactBootstrapDropdown.Item>
        );
      }) ?? [],
    [portalOptions, setValue, fieldName]
  );

  const renderedTitle = useMemo(() => {
    if (!selected) {
      return "Select a space";
    }

    const space = portals?.[selected.slug] ?? parentSpace;

    const spaceIcon = PORTAL_INFO_ICON_MAPPING[space?.template ?? ""];

    return (
      <span className="SpacesDropdown__value">
        {selected.slug !== spaceNoneOption.none.slug ? (
          <img
            alt={`space-icon-${spaceIcon}`}
            src={spaceIcon}
            className="SpacesDropdown__item-icon"
          />
        ) : null}
        {selected.slug || noneOptionName}
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
