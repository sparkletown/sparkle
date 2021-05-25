import React, { useCallback, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import firebase from "firebase/app";

import { MAX_TABLE_CAPACITY, MIN_TABLE_CAPACITY } from "settings";

import { Table } from "types/Table";

import { useVenueId } from "hooks/useVenueId";
import { useUser } from "hooks/useUser";

import { InputField } from "components/atoms/InputField";

import "./EditTableTitleModal.scss";

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
  tables: Table[];
  tableOfUser?: Table;
  onHide: () => void;
}

export const EditTableTitleModal: React.FC<EditTableTitleModalProps> = ({
  isShown,
  title,
  tables,
  tableOfUser,
  subtitle,
  capacity,
  onHide,
}) => {
  const { user } = useUser();
  const venueId = useVenueId();

  const formDefaultValues = useMemo(
    () => ({
      title,
      subtitle,
      capacity,
    }),
    [capacity, subtitle, title]
  );

  const {
    register,
    handleSubmit,
    errors,
    watch,
    reset,
  } = useForm<EditTableForm>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: formDefaultValues,
  });

  // Updates the default values whenever they change. This is required because they are cached after the first render.
  useEffect(() => {
    reset(formDefaultValues);
  }, [formDefaultValues, reset, title]);

  // use useAsyncFn for easier error handling, instead of state hook
  const [{ error }, updateTables] = useAsyncFn(
    async (values: EditTableForm) => {
      if (!user || !tableOfUser || !venueId) return;

      const updatedTable = {
        ...tableOfUser,
        title: values.title,
        subtitle: values.subtitle,
        capacity: values.capacity,
      };

      return await firebase.functions().httpsCallable("venue-updateTables")({
        venueId,
        tables,
        updatedTable,
      });
    },
    [tableOfUser, tables, user, venueId]
  );

  const values = watch();

  const onSubmit = useCallback(async () => {
    await updateTables(values).then(() => {
      onHide();
    });
  }, [onHide, updateTables, values]);

  return (
    <Modal show={isShown} onHide={onHide}>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="EditTableTitleModal">
          <InputField
            ref={register({ required: true })}
            name="title"
            defaultValue={title}
            containerClassName="EditTableTitleModal__input--spacing"
            placeholder="Table topic"
          />
          {errors.title && errors.title.type === "required" && (
            <span className="input-error">Topic is required</span>
          )}

          <InputField
            ref={register}
            name="subtitle"
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
              Capacity must be between
              {` ${MIN_TABLE_CAPACITY} and ${MAX_TABLE_CAPACITY}`}
            </span>
          )}
          {error && <label className="input-error">{error.message}</label>}

          <div className="EditTableTitleModal__footer-buttons">
            <button
              className="btn btn-centered btn-secondary"
              onClick={onHide}
              type="button"
            >
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
