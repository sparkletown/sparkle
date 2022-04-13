import React, { useEffect, useMemo, useState } from "react";
import { FieldError, UseFormRegister, UseFormSetValue } from "react-hook-form";
import classNames from "classnames";
import { Dropdown } from "components/admin/Dropdown";
import { omit, omitBy } from "lodash";

import { ALWAYS_EMPTY_ARRAY, PORTAL_INFO_ICON_MAPPING } from "settings";

import { SpaceWithId } from "types/id";
import { AnyForm } from "types/utility";
import { PortalTemplate } from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import { isDefaultPortalIcon } from "utils/image";

import "./SpacesDropdown.scss";

const noneOptionName = "None";
const spaceNoneOption = Object.freeze({
  id: "",
  name: "",
  template: undefined,
  host: { icon: "" },
});

// @debt define an interface for spaceNoneOption that also factors in the Space interface to keep both in lockstep
// NOTE: using host this way matches the space entity type and doesn't trigger TS errors

type SpacesDropdownPortal = {
  template?: PortalTemplate;
  name: string;
  id?: string;
  icon?: string;
};

interface SpacesDropdownProps {
  parentSpace?: SpacesDropdownPortal;
  setValue: UseFormSetValue<AnyForm>;
  register: UseFormRegister<AnyForm>;
  fieldName: string;
  error?: FieldError;
  spaces: Record<string, SpaceWithId>;
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
      spaceOptions.map(({ id, name, template, host }) => {
        const spaceIcon = PORTAL_INFO_ICON_MAPPING[template ?? ""];
        const spaceIconClasses = classNames("w-6 h-6 mr-2 rounded-full", {
          "bg-gray-800": isDefaultPortalIcon(host?.icon || spaceIcon),
        });

        return (
          <div
            key={id}
            onClick={() => {
              setSelected({ name, template, id });
              setValue(fieldName, id, { shouldValidate: true });
            }}
            data-dropdown-value={name}
            className="flex items-center w-max"
          >
            {name !== spaceNoneOption.name ? (
              <img
                alt="space-option-icon"
                src={host?.icon || spaceIcon}
                className={spaceIconClasses}
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
      return <span data-dropdown-value="">Select a space</span>;
    }

    const space = spaces?.[selected.id ?? ""] ?? parentSpace;

    const spaceIcon = PORTAL_INFO_ICON_MAPPING[space?.template ?? ""];
    const spaceIconClasses = classNames("w-6 h-6 mr-2 rounded-full", {
      "bg-gray-800": isDefaultPortalIcon(spaceIcon),
    });

    return (
      <span className="flex items-center" data-dropdown-value={selected.name}>
        {selected.name !== spaceNoneOption.name ? (
          <img
            alt={`space-icon-${spaceIcon}`}
            src={spaceIcon}
            className={spaceIconClasses}
          />
        ) : null}
        {selected.name || noneOptionName}
      </span>
    );
  }, [spaces, selected, parentSpace]);

  return (
    <>
      <div data-bem="SpacesDropdown" className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Link portal to a space
        </label>
        <Dropdown title={renderedTitle} titleElement={renderedTitle}>
          {renderedOptions}
        </Dropdown>
        <input type="hidden" {...register} name={fieldName} />
      </div>
      {error && <span className="input-error">{error.message}</span>}
    </>
  );
};
