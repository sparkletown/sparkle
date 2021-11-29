import React, { Fragment, useCallback, useMemo, useState } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import { get } from "lodash";

import { PortalInfoListItem } from "settings";

import { PortalAddModal } from "components/molecules/PortalAddModal";
import { PortalListItem } from "components/molecules/PortalListItem";

import "./PortalList.scss";

export type PortalListVariant = "input" | "modal";

export interface PortalListProps {
  errors?: FieldErrors<FieldValues>;
  items: PortalInfoListItem[];
  name?: string;
  onClick?: (context: { item: PortalInfoListItem; index: number }) => void;
  register?: (Ref: unknown, RegisterOptions?: unknown) => void;
  selectedItem?: PortalInfoListItem;
  variant: PortalListVariant;
}

export const PortalList: React.FC<PortalListProps> = ({
  errors,
  items,
  name,
  onClick,
  register,
  selectedItem,
  variant,
}) => {
  const error = name && get(errors, name);

  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const clearSelectedIndex = useCallback(() => setSelectedIndex(undefined), [
    setSelectedIndex,
  ]);

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
          {variant === "modal" && (
            <PortalAddModal
              item={item}
              show={selectedIndex === index}
              onHide={clearSelectedIndex}
            />
          )}
        </Fragment>
      )),
    [items, onClick, clearSelectedIndex, selectedIndex, selectedItem, variant]
  );

  return (
    <div className="PortalList">
      {variant === "input" && (
        <input
          className="PortalList__input"
          type="hidden"
          name={name}
          ref={register}
        />
      )}
      {renderedItems}
      {error && <span className="AdminInput__error">{error?.message}</span>}
    </div>
  );
};
