import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";

import { MAX_TABLE_CAPACITY, MIN_TABLE_CAPACITY } from "settings";

import { Table } from "types/Table";

import { useUser } from "hooks/useUser";

import { InputField } from "components/atoms/InputField";

import "./EditTableTitleModal.scss";
import { updateVenue_v2 } from "api/admin";

export interface EditTableForm {
  title: string;
  subtitle?: string;
  capacity: number;
}

export interface EditTableTitleModalProps {
  isShown: boolean;
  title: string;
  subtitle?: string;
  capacity: number;
  venueName: string;
  tables: Table[];
  tableOfUser?: Table;
  onHide: () => void;
}

export const EditTableTitleModal: React.FC<EditTableTitleModalProps> = ({
  isShown,
  title,
  subtitle,
  capacity,
  venueName,
  tables,
  tableOfUser,
  onHide,
}) => {
  const { user } = useUser();

  const { register, handleSubmit, errors, watch } = useForm<EditTableForm>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      title,
      subtitle,
      capacity,
    },
  });

  // use useAsyncFn for easier error handling, instead of state hook
  const [{ error }, updateTables] = useAsyncFn(
    async (values: EditTableForm) => {
      if (!user) return;

      const venueTables = tables.map((table) => {
        if (table.reference === tableOfUser?.reference) {
          return {
            ...table,
            title: values.title,
            subtitle: values.subtitle,
            capacity: values.capacity,
          };
        }
        return table;
      });

      // Ideally we want to do this only when config.tables doesn't exist. Otherwise we want to update only a single table.
      return await updateVenue_v2(
        { name: venueName, tables: venueTables },
        user
      );
    },
    []
  );

  const values = watch();

  const onSubmit = useCallback(async () => {
    await updateTables(values);
    onHide();
  }, [onHide, updateTables, values]);

  return (
    <Modal show={isShown} onHide={onHide}>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="EditTableTitleModal">
          <InputField
            ref={register({ required: true })}
            name="title"
            containerClassName="EditTableTitleModal__input--spacing"
            placeholder="Table topic"
          />
          {errors.title && errors.title.type === "required" && (
            <span className="input-error">Topic is required</span>
          )}

          <InputField
            ref={register}
            name="description"
            containerClassName="EditTableTitleModal__input--spacing"
            placeholder="Describe this table (optional)"
          />

          <div className="EditTableTitleModal__capacity">
            <label className="EditTableTitleModal__max-capacity">
              Number of seats (max {MAX_TABLE_CAPACITY})
            </label>
            <InputField
              ref={register({
                required: true,
                max: MAX_TABLE_CAPACITY,
                min: MIN_TABLE_CAPACITY,
              })}
              name="capacity"
              type="number"
              min={MIN_TABLE_CAPACITY}
              max={MAX_TABLE_CAPACITY}
              placeholder="Max seats"
            />
          </div>
          {errors.capacity?.type === "required" && (
            <span className="input-error">Capacity is required</span>
          )}
          {(errors.capacity?.type === "min" ||
            errors.capacity?.type === "max") && (
            <span className="input-error">
              Capacity must be between {MIN_TABLE_CAPACITY} and{" "}
              {MAX_TABLE_CAPACITY}
            </span>
          )}
          {error && <label className="input-error">{error}</label>}

          <div className="EditTableTitleModal__footer-buttons">
            <button className="btn btn-centered btn-secondary" onClick={onHide}>
              Cancel
            </button>
            <button type="submit" className="btn btn-centered btn-primary">
              Save
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};
