import React, { Fragment, useCallback, useMemo, useState } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import { get } from "lodash";

import { SpacePortalsListItem } from "settings";

import { PortalAddModal } from "components/molecules/PortalAddModal";
import { PortalListItem } from "components/molecules/PortalListItem";

import "./PortalList.scss";

export type PortalListVariant = "input" | "modal";

export interface PortalListProps {
  errors?: FieldErrors<FieldValues>;
  items: SpacePortalsListItem[];
  name?: string;
  onClick?: (context: { item: SpacePortalsListItem; index: number }) => void;
  register?: (Ref: unknown, RegisterOptions?: unknown) => void;
  variant: string;
}

export const PortalList: React.FC<PortalListProps> = ({
  errors,
  items,
  name,
  onClick,
  register,
  variant,
}) => {
  const error = name && get(errors, name);

  const [selected, setSelected] = useState<number | undefined>();

  const clearSelected = useCallback(() => setSelected(undefined), [
    setSelected,
  ]);

  const renderedItems = useMemo(
    () =>
      items.map((item, index) => (
        <Fragment key={`${index}-${item.template}`}>
          <PortalListItem
            item={item}
            tabIndex={index + 1}
            onClick={() => {
              setSelected(index);
              onClick?.({ item, index });
            }}
          />
          {variant === "modal" && (
            <PortalAddModal
              item={item}
              show={selected === index}
              onHide={clearSelected}
            />
          )}
          {variant === "input" && (
            <input
              className="PortalList__input"
              type="hidden"
              name={name}
              ref={register}
            />
          )}
        </Fragment>
      )),
    [items, onClick, clearSelected, selected, variant, name, register]
  );

  return (
    <div className="PortalList">
      {renderedItems}
      {error && <span className="AdminInput__error">{error?.message}</span>}
    </div>
  );
};
