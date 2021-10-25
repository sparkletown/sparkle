import { useCallback, useMemo, useState } from "react";
import classNames from "classnames";

import "./Breadcrumbs.scss";

export interface BreadcrumbsLocation {
  key: string;
  name?: string;
}
export interface BreadcrumbsProps {
  containerClassName?: string;
  label?: string;
  locations: BreadcrumbsLocation[];
  defaultLocation?: string;
  onSelect: (key: string) => void;
}

/**
 * The Breadcrumbs component is used for navigation.
 *
 * Example:
 *     Label: location1 / location 2
 *
 *     Events on: Sovereign Venue / Current Venue
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  containerClassName,
  label,
  locations,
  defaultLocation,
  onSelect,
}) => {
  const [selectedOption, setSeletectedOption] = useState(
    defaultLocation ?? locations[0]?.key
  );

  const selectLocation = useCallback(
    (key) => {
      setSeletectedOption(key);
      onSelect(key);
    },
    [onSelect]
  );

  const renderedLocations = useMemo(
    () =>
      locations.map(({ key, name }, isNotFirst) => (
        <span key={key}>
          {!!isNotFirst && <span className="Breadcrumbs__separator"> / </span>}
          <button
            className={classNames("Breadcrumbs__button button--a", {
              "Breadcrumbs__button--selected": selectedOption === key,
            })}
            onClick={() => selectLocation(key)}
          >
            {name ?? key}
          </button>
        </span>
      )),
    [selectedOption, locations, selectLocation]
  );

  return (
    <div className={classNames("Breadcrumbs", containerClassName)}>
      {label && <span className="Breadcrumbs__label">{label}: </span>}
      {renderedLocations}
    </div>
  );
};
