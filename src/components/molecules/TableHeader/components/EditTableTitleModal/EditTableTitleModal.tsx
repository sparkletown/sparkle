import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import classNames from "classnames";

import { MAX_TABLE_CAPACITY, MIN_TABLE_CAPACITY } from "settings";

import { updateVenueTable } from "api/table";

import { Table } from "types/Table";

import { useVenueId } from "hooks/useVenueId";

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
  const venueId = useVenueId();

  const formDefaultValues = useMemo(
    () => ({
      title,
      subtitle,
      capacity,
    }),
    [capacity, subtitle, title]
  );

  const { register, handleSubmit, errors, reset } = useForm<EditTableForm>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: formDefaultValues,
  });

  // Updates the default values whenever they change. This is required because they are cached after the first render.
  useEffect(() => {
    reset(formDefaultValues);
  }, [formDefaultValues, reset, title]);

  // use useAsyncFn for easier error handling, instead of state hook
  const [{ error: httpError, loading: isUpdating }, updateTables] = useAsyncFn(
    async (values: EditTableForm) => {
      if (!venueId || !tableOfUser) return;

      await updateVenueTable({
        ...values,
        venueId,
        tableOfUser,
        tables,
      }).then(onHide);
    },
    [onHide, tableOfUser, tables, venueId]
  );

  const saveButtonClassNames = classNames("btn btn-centered btn-primary", {
    disabled: isUpdating,
  });

  return (
    <Modal show={isShown} onHide={onHide}>
      <Modal.Body>
        <form
          onSubmit={handleSubmit(updateTables)}
          className="EditTableTitleModal"
        >
          <InputField
            ref={register({ required: true })}
            name="title"
            containerClassName="EditTableTitleModal__input--spacing"
            placeholder="Table topic"
            disabled={isUpdating}
          />
          {errors.title?.type === "required" && (
            <span className="input-error">Topic is required</span>
          )}

          <InputField
            ref={register}
            name="subtitle"
            containerClassName="EditTableTitleModal__input--spacing"
            placeholder="Describe this table (optional)"
            disabled={isUpdating}
          />

          <div className="EditTableTitleModal__capacity">
            <label className="EditTableTitleModal__max-capacity">
              Number of seats (max {MAX_TABLE_CAPACITY})
              <InputField
                ref={register({
                  required: true,
                  max: MAX_TABLE_CAPACITY,
                  min: MIN_TABLE_CAPACITY,
                })}
                className="EditTableTitleModal__max-capacity--input"
                name="capacity"
                type="number"
                disabled={isUpdating}
                min={MIN_TABLE_CAPACITY}
                max={MAX_TABLE_CAPACITY}
                placeholder="Max seats"
              />
            </label>
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
          {httpError && (
            <label className="input-error">{httpError.message}</label>
          )}

          <div className="EditTableTitleModal__footer-buttons">
            <button
              className="btn btn-centered btn-secondary"
              onClick={onHide}
              type="button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className={saveButtonClassNames}
            >
              Save
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};
