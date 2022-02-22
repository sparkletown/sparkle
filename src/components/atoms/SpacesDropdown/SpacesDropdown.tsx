import React, { useEffect, useMemo, useState } from "react";
import { FieldError, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { omit, omitBy } from "lodash";

import { ALWAYS_EMPTY_ARRAY, PORTAL_INFO_ICON_MAPPING } from "settings";

import { AnyForm } from "types/utility";
import { AnyVenue, PortalTemplate } from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import { WithId } from "utils/id";

import { Dropdown } from "components/atoms/Dropdown";

import "./SpacesDropdown.scss";

const noneOptionName = "None";
const spaceNoneOption = Object.freeze({
  id: "",
  name: "",
  template: undefined,
});

type SpacesDropdownPortal = {
  template?: PortalTemplate;
  name: string;
  id?: string;
};

interface SpacesDropdownProps {
  parentSpace?: SpacesDropdownPortal;
  setValue: UseFormSetValue<AnyForm>;
  register: UseFormRegister<AnyForm>;
  fieldName: string;
  error?: FieldError;
  spaces: Record<string, WithId<AnyVenue>>;
}

export const SpacesDropdown: React.FC<SpacesDropdownProps> = ({
  parentSpace,
  spaces,
  setValue,
  register,
  fieldName,
  error,
}) => {
  // @debt SpacesDropdown should not know about the concept of parent spaces
  // It should be getting the value from the form values instead.
  const [selected, setSelected] = useState(parentSpace);

  // @debt: Probably need to omit returning playa from the useOwnedVenues as it's deprecated and
  // doesn't exist on SPACE_PORTALS_ICONS_MAPPING
  const spacesWithoutPlaya = omit(spaces, VenueTemplate.playa);
  // @debt Filter out all the poster pages as poster hall currently uses (abuses?)
  // spaces by creating a space for every single poster page. They aren't
  // proper spaces though. We should make a better way of handling this.
  const filteredSpaces = omitBy(
    spacesWithoutPlaya,
    (s) => s.template === VenueTemplate.posterpage
  );
  const sortedSpaces = useMemo(
    () =>
      Object.values(filteredSpaces).sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    [filteredSpaces]
  );

  const spaceOptions = useMemo(() => [spaceNoneOption, ...sortedSpaces], [
    sortedSpaces,
  ]);

  useEffect(() => {
    if (parentSpace) {
      setSelected(parentSpace);
    }
  }, [parentSpace]);

  const renderedOptions = useMemo(
    () =>
      spaceOptions.map(({ id, name, template }) => {
        const spaceIcon = PORTAL_INFO_ICON_MAPPING[template ?? ""];

        return (
          <div
            key={id}
            onClick={() => {
              setSelected({ name, template, id });
              setValue(fieldName, id, { shouldValidate: true });
            }}
            className="SpacesDropdown__item"
            data-dropdown-value={name}
          >
            {name !== spaceNoneOption.name ? (
              <img
                alt={`space-icon-${spaceIcon}`}
                src={spaceIcon}
                className="SpacesDropdown__item-icon"
              />
            ) : null}
            {name || noneOptionName}
          </div>
        );
      }) ?? ALWAYS_EMPTY_ARRAY,
    [spaceOptions, setValue, fieldName]
  );

  const renderedTitle = useMemo(() => {
    if (!selected) {
      return { value: "", label: "Select a space" };
    }

    const space = spaces?.[selected.id ?? ""] ?? parentSpace;

    const spaceIcon = PORTAL_INFO_ICON_MAPPING[space?.template ?? ""];

    return (
      <span
        className="SpacesDropdown__value"
        data-dropdown-value={selected.name}
      >
        {selected.name !== spaceNoneOption.name ? (
          <img
            alt={`space-icon-${spaceIcon}`}
            src={spaceIcon}
            className="SpacesDropdown__item-icon"
          />
        ) : null}
        {selected.name || noneOptionName}
      </span>
    );
  }, [spaces, selected, parentSpace]);

  return (
    <>
      <div className="SpacesDropdown">
        <Dropdown title={renderedTitle}>{renderedOptions}</Dropdown>
        <input type="hidden" {...register} name={fieldName} />
      </div>
      {error && <span className="input-error">{error.message}</span>}
    </>
  );
};
