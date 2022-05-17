import React, { useEffect, useMemo, useState } from "react";
import { FieldError, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Dropdown } from "components/admin/Dropdown";
import { omitBy } from "lodash";

import { PORTAL_INFO_ICON_MAPPING } from "settings";

import { SpaceWithId } from "types/id";
import { AnyForm } from "types/utility";
import { PortalTemplate } from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import "./SpacesDropdown.scss";

const noneOptionName = "None";

interface SpacesOption {
  template?: PortalTemplate;
  label: string;
  id?: string;
  icon?: string;
}

const spaceNoneOption = Object.freeze({
  id: "",
  label: "None",
  template: undefined,
  icon: "",
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
  label?: string;
  subtext?: string;
  disabled?: boolean;
}

export const SpacesDropdown: React.FC<SpacesDropdownProps> = ({
  parentSpace,
  spaces,
  setValue,
  register,
  fieldName,
  error,
  subtext,
  label,
  disabled = false,
}) => {
  // @debt SpacesDropdown should not know about the concept of parent spaces
  // It should be getting the value from the form values instead.
  const [selected, setSelected] = useState(parentSpace);

  // @debt Filter out all the poster pages as poster hall currently uses (abuses?)
  // spaces by creating a space for every single poster page. They aren't
  // proper spaces though. We should make a better way of handling this.
  const filteredSpaces = omitBy(
    spaces,
    (s) => s.template === VenueTemplate.posterpage
  );
  const sortedSpaces = useMemo(
    () =>
      Object.values(filteredSpaces).sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    [filteredSpaces]
  );

  const remapSpaces = sortedSpaces.map((space) => {
    const spaceIcon = space?.host?.icon
      ? space?.host?.icon
      : PORTAL_INFO_ICON_MAPPING[space.template ?? ""];
    return {
      id: space.id,
      label: space.name,
      template: space.template,
      icon: spaceIcon,
    };
  });

  const spaceOptions: SpacesOption[] = useMemo(
    () => [spaceNoneOption, ...remapSpaces],
    [remapSpaces]
  );

  useEffect(() => {
    if (parentSpace) {
      setSelected(parentSpace);
    }
  }, [parentSpace]);

  const select = ({ label, id, icon, template }: SpacesOption) => {
    setSelected({ name: label, id, icon, template });
    setValue(fieldName, id, { shouldValidate: true });
  };

  return (
    <>
      <div data-bem="SpacesDropdown" className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label ? label : "Link portal to a space"}
        </label>
        <Dropdown
          title={selected?.name || noneOptionName}
          options={spaceOptions}
          onSelect={(space) => select(space)}
        />
        <input type="hidden" {...register} name={fieldName} />
      </div>
      {subtext && <span className="mt-2 text-sm text-gray-500">{subtext}</span>}

      {error && <span className="input-error">{error.message}</span>}
    </>
  );
};
