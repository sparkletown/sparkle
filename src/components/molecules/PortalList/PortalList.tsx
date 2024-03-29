import React, { Fragment, ReactNode, useMemo, useState } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { get } from "lodash";

import { PortalInfoItem } from "settings";

import { AnyForm } from "types/utility";

import { PortalListItem } from "components/molecules/PortalListItem";

import "./PortalList.scss";

interface PortalListProps {
  errors?: FieldErrors<FieldValues>;
  items: PortalInfoItem[];
  label?: ReactNode | string;
  name?: string;
  onClick?: (context: { item: PortalInfoItem; index: number }) => void;
  register?: UseFormRegister<AnyForm>;
  selectedItem?: PortalInfoItem;
}

export const PortalList: React.FC<PortalListProps> = ({
  errors,
  items,
  label,
  name,
  onClick,
  register,
  selectedItem,
}) => {
  const error = name && get(errors, name);

  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  const renderedItems = useMemo(
    () =>
      items.map((item, index) => (
        <Fragment key={`${index}-${item.template}`}>
          <PortalListItem
            item={item}
            selected={selectedItem === item || index === selectedIndex}
            tabIndex={index + 1}
            onClick={() => {
              setSelectedIndex(index);
              onClick?.({ item, index });
            }}
          />
        </Fragment>
      )),
    [items, onClick, selectedIndex, selectedItem]
  );

  const renderedInput = (
    <input
      className="PortalList__input"
      type="hidden"
      name={name}
      {...register}
    />
  );

  const renderedLabel = (
    <label className="PortalList__label">
      {label} {renderedInput}
    </label>
  );

  return (
    <div className="PortalList">
      {label ? renderedLabel : renderedInput}
      {error && <span className="PortalList__error">{error?.message}</span>}
      {renderedItems}
    </div>
  );
};
